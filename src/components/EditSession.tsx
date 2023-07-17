import { Flex, Heading } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import supabaseType from "../resources/types";

interface EditSessionProps {
  supabase: supabaseType;
}

const EditSession = ({ supabase }: EditSessionProps) => {
  let { sessionId } = useParams();
  const [session, setSession] = useState<any>({});

  useEffect(() => {
    const fetchSessionDetails = async () => {
      try {
        let { data: sessions } = await supabase
          .from("sessions")
          .select("*")
          .eq("id", sessionId);
        if (sessions) {
          const fetchedSession = sessions[0];
          setSession(fetchedSession);
        }
      } catch (error) {
        console.error(error);
      }
    };
    fetchSessionDetails();
  }, []);

  return (
    <Flex>
      <Heading>Edit Session</Heading>
      <Flex>{JSON.stringify(session, null, 4)}</Flex>
    </Flex>
  );
};
export default EditSession;
