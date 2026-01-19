import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface MoistureSettings {
  id: string;
  min_moisture: number;
  max_moisture: number;
}

const DEFAULT_SETTINGS = {
  min_moisture: 4.5,
  max_moisture: 7.0,
};

export const useMoistureSettings = () => {
  const [settings, setSettings] = useState<MoistureSettings | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  // Fetch settings from database
  const fetchSettings = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from('moisture_settings')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (error) throw error;

      if (data) {
        setSettings({
          id: data.id,
          min_moisture: Number(data.min_moisture),
          max_moisture: Number(data.max_moisture),
        });
      }
    } catch (error) {
      console.error('Error fetching moisture settings:', error);
      // Use default values on error
      setSettings({
        id: '',
        ...DEFAULT_SETTINGS,
      });
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Save settings to database
  const saveSettings = useCallback(async (minMoisture: number, maxMoisture: number) => {
    setIsSaving(true);
    try {
      // Validate input
      if (minMoisture >= maxMoisture) {
        toast.error('Batas bawah harus lebih kecil dari batas atas');
        return false;
      }

      if (minMoisture < 0 || maxMoisture > 15) {
        toast.error('Nilai moisture harus antara 0% - 15%');
        return false;
      }

      if (settings?.id) {
        // Update existing record
        const { error } = await supabase
          .from('moisture_settings')
          .update({
            min_moisture: minMoisture,
            max_moisture: maxMoisture,
          })
          .eq('id', settings.id);

        if (error) throw error;
      } else {
        // Insert new record
        const { error } = await supabase
          .from('moisture_settings')
          .insert({
            min_moisture: minMoisture,
            max_moisture: maxMoisture,
          });

        if (error) throw error;
      }

      // Update local state
      setSettings(prev => prev ? {
        ...prev,
        min_moisture: minMoisture,
        max_moisture: maxMoisture,
      } : {
        id: '',
        min_moisture: minMoisture,
        max_moisture: maxMoisture,
      });

      toast.success('Standar moisture berhasil disimpan');
      return true;
    } catch (error) {
      console.error('Error saving moisture settings:', error);
      toast.error('Gagal menyimpan standar moisture');
      return false;
    } finally {
      setIsSaving(false);
    }
  }, [settings?.id]);

  // Fetch settings on mount
  useEffect(() => {
    fetchSettings();
  }, [fetchSettings]);

  // Subscribe to realtime updates
  useEffect(() => {
    const channel = supabase
      .channel('moisture_settings_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'moisture_settings',
        },
        (payload) => {
          if (payload.new && typeof payload.new === 'object' && 'min_moisture' in payload.new) {
            const newData = payload.new as { id: string; min_moisture: number; max_moisture: number };
            setSettings({
              id: newData.id,
              min_moisture: Number(newData.min_moisture),
              max_moisture: Number(newData.max_moisture),
            });
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return {
    moistureMin: settings?.min_moisture ?? DEFAULT_SETTINGS.min_moisture,
    moistureMax: settings?.max_moisture ?? DEFAULT_SETTINGS.max_moisture,
    isLoading,
    isSaving,
    saveSettings,
    refetch: fetchSettings,
  };
};
