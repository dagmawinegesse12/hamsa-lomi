import { Body, Container, Head, Heading, Html, Preview, Text } from "@react-email/components";

type Props = {
  name: string;
  month: string;
  amount: string;
  dueDate: string;
};

export function PaymentReminderEmail({ name, month, amount, dueDate }: Props) {
  return (
    <Html>
      <Head />
      <Preview>Your Edir dues are overdue</Preview>
      <Body>
        <Container>
          <Heading>Monthly dues reminder</Heading>
          <Text>Dear {name},</Text>
          <Text>
            Your {month} dues of {amount} are overdue. Please make payment by {dueDate} to avoid penalty.
          </Text>
        </Container>
      </Body>
    </Html>
  );
}
