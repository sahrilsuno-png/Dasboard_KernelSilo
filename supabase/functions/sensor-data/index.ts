import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface SensorData {
  silo1_moisture: number;
  silo1_temp: number;
  silo2_moisture: number;
  silo2_temp: number;
  device_id?: string;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Only accept POST requests
    if (req.method !== "POST") {
      return new Response(
        JSON.stringify({ error: "Method not allowed. Use POST." }),
        { status: 405, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Parse request body
    const body: SensorData = await req.json();
    
    // Validate required fields
    if (
      body.silo1_moisture === undefined ||
      body.silo1_temp === undefined ||
      body.silo2_moisture === undefined ||
      body.silo2_temp === undefined
    ) {
      return new Response(
        JSON.stringify({
          error: "Missing required fields",
          required: ["silo1_moisture", "silo1_temp", "silo2_moisture", "silo2_temp"],
          example: {
            silo1_moisture: 5.5,
            silo1_temp: 42.0,
            silo2_moisture: 6.2,
            silo2_temp: 45.0,
            device_id: "ESP32_01"
          }
        }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Validate data ranges
    const validateRange = (value: number, min: number, max: number, field: string) => {
      if (value < min || value > max) {
        throw new Error(`${field} must be between ${min} and ${max}. Got: ${value}`);
      }
    };

    try {
      validateRange(body.silo1_moisture, 0, 100, "silo1_moisture");
      validateRange(body.silo2_moisture, 0, 100, "silo2_moisture");
      validateRange(body.silo1_temp, -40, 150, "silo1_temp");
      validateRange(body.silo2_temp, -40, 150, "silo2_temp");
    } catch (validationError: unknown) {
      const errorMessage = validationError instanceof Error ? validationError.message : "Validation failed";
      return new Response(
        JSON.stringify({ error: errorMessage }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Create Supabase client
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Insert data into database
    const { data, error } = await supabase
      .from("logsheet_entries")
      .insert({
        silo1_moisture: body.silo1_moisture,
        silo1_temp: body.silo1_temp,
        silo2_moisture: body.silo2_moisture,
        silo2_temp: body.silo2_temp,
        timestamp: new Date().toISOString(),
      })
      .select()
      .single();

    if (error) {
      console.error("Database error:", error);
      return new Response(
        JSON.stringify({ error: "Failed to save data", details: error.message }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Check for alerts (moisture out of range)
    const MOISTURE_MIN = 4.5;
    const MOISTURE_MAX = 7.0;
    const alerts = [];

    if (body.silo1_moisture < MOISTURE_MIN) {
      alerts.push({ silo: 1, type: "low", value: body.silo1_moisture });
    } else if (body.silo1_moisture > MOISTURE_MAX) {
      alerts.push({ silo: 1, type: "high", value: body.silo1_moisture });
    }

    if (body.silo2_moisture < MOISTURE_MIN) {
      alerts.push({ silo: 2, type: "low", value: body.silo2_moisture });
    } else if (body.silo2_moisture > MOISTURE_MAX) {
      alerts.push({ silo: 2, type: "high", value: body.silo2_moisture });
    }

    console.log(`Data received from ${body.device_id || "unknown"}: Silo1=${body.silo1_moisture}%, Silo2=${body.silo2_moisture}%`);

    return new Response(
      JSON.stringify({
        success: true,
        message: "Data saved successfully",
        data: {
          id: data.id,
          timestamp: data.timestamp,
          silo1_moisture: data.silo1_moisture,
          silo1_temp: data.silo1_temp,
          silo2_moisture: data.silo2_moisture,
          silo2_temp: data.silo2_temp,
        },
        alerts: alerts.length > 0 ? alerts : null,
        thresholds: {
          moisture_min: MOISTURE_MIN,
          moisture_max: MOISTURE_MAX,
        }
      }),
      { status: 201, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );

  } catch (error: unknown) {
    console.error("Error processing request:", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    return new Response(
      JSON.stringify({ error: "Internal server error", details: errorMessage }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});