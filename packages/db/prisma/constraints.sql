CREATE EXTENSION IF NOT EXISTS pgcrypto;

ALTER TABLE "DuePayment"
  ADD CONSTRAINT "DuePayment_period_format" CHECK ("period" ~ '^[0-9]{4}-(0[1-9]|1[0-2])$'),
  ADD CONSTRAINT "DuePayment_amount_positive" CHECK ("amount" > 0);

ALTER TABLE "DueSchedule"
  ADD CONSTRAINT "DueSchedule_period_format" CHECK ("period" ~ '^[0-9]{4}-(0[1-9]|1[0-2])$'),
  ADD CONSTRAINT "DueSchedule_amount_positive" CHECK ("amount" > 0);

ALTER TABLE "PenaltyRecord"
  ADD CONSTRAINT "PenaltyRecord_period_format" CHECK ("period" ~ '^[0-9]{4}-(0[1-9]|1[0-2])$'),
  ADD CONSTRAINT "PenaltyRecord_amount_nonnegative" CHECK ("penaltyAmount" >= 0);

ALTER TABLE "MembershipTier"
  ADD CONSTRAINT "MembershipTier_monthly_due_positive" CHECK ("monthlyDue" > 0);

ALTER TABLE "DeathClaim"
  ADD CONSTRAINT "DeathClaim_benefit_nonnegative" CHECK ("benefitAmount" >= 0);

ALTER TABLE "ExpenseRecord"
  ADD CONSTRAINT "ExpenseRecord_amount_positive" CHECK ("amount" > 0);
