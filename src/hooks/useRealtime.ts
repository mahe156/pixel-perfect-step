import { useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useQueryClient } from "@tanstack/react-query";

export function useRealtimeSubmissions() {
  const { profile } = useAuth();
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!profile) return;

    const channel = supabase
      .channel("submission-views")
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "submissions",
        },
        () => {
          queryClient.invalidateQueries({ queryKey: ["submissions"] });
          queryClient.invalidateQueries({ queryKey: ["earnings"] });
        }
      )
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [profile, queryClient]);
}

export function useRealtimeCampaign(campaignId?: string) {
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!campaignId) return;

    const channel = supabase
      .channel(`campaign-${campaignId}`)
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "campaigns",
          filter: `id=eq.${campaignId}`,
        },
        () => {
          queryClient.invalidateQueries({ queryKey: ["campaign", campaignId] });
        }
      )
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [campaignId, queryClient]);
}

export function useRealtimeAdminFeed(onNewSubmission?: (payload: any) => void) {
  useEffect(() => {
    const channel = supabase
      .channel("admin-feed")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "submissions",
        },
        (payload) => {
          onNewSubmission?.(payload.new);
        }
      )
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [onNewSubmission]);
}
