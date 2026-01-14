import type { SessionWithActivitiesResource } from "@clerk/types";
import { useEffect, useState } from "react";
import { useSession, useUser } from "@clerk/clerk-expo";
import { usePostHog } from "posthog-react-native";

export function useDeviceLimit() {
  const { user, isLoaded } = useUser();
  const { session } = useSession();

  const [otherSessions, setOtherSessions] = useState<
    SessionWithActivitiesResource[]
  >([]);
  const [blocked, setBlocked] = useState(false);
  const posthog = usePostHog();

  useEffect(() => {
    if (!isLoaded || !user || !session) return;

    (async () => {
      const sessions = await user.getSessions();

      const activeOtherSessions = sessions.filter(
        (s) => s.id !== session.id && s.status === "active",
      );

      if (activeOtherSessions.length > 0) {
        setOtherSessions(activeOtherSessions);
        setBlocked(true);
      }
    })().catch((e) => posthog.captureException(e));
  }, [isLoaded, session, posthog, user]);

  const signOutOtherDevices = async () => {
    for (const s of otherSessions) {
      await s.revoke();
    }
    setBlocked(false);
  };

  return {
    blocked,
    otherSessions,
    signOutOtherDevices,
  };
}
