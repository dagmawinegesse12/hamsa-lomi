"use client";

import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

const templates = {
  MISSED_PAYMENT: "Dear [Name], your [Month] dues of [Amount] are overdue. Please make payment by [Date] to avoid penalty.",
  CLAIM_STATUS: "Your claim #[ID] has been [approved/rejected]. Please contact the board if you have questions.",
  MEETING_REMINDER: "The [General/Board] assembly meeting is scheduled for [Date] at [Time]. Please confirm attendance.",
  SUSPENSION_WARNING: "Your membership is at risk of suspension due to [Reason]. Please contact the Edir board.",
  WELCOME: "Welcome to the Edir community. Your membership is active and your benefit schedule is now available.",
  CUSTOM: ""
};

const channels = ["EMAIL", "SMS", "PUSH", "IN_APP"] as const;

export function NotificationComposer() {
  const [recipientMode, setRecipientMode] = useState("ALL");
  const [selectedChannels, setSelectedChannels] = useState<string[]>(["EMAIL", "IN_APP"]);
  const [template, setTemplate] = useState<keyof typeof templates>("MISSED_PAYMENT");
  const [title, setTitle] = useState("Monthly dues reminder");
  const [body, setBody] = useState(templates.MISSED_PAYMENT);
  const [scheduledFor, setScheduledFor] = useState("");

  const smsPreview = useMemo(() => body.replace(/\s+/g, " ").slice(0, 160), [body]);

  function applyTemplate(nextTemplate: keyof typeof templates) {
    setTemplate(nextTemplate);
    setBody(templates[nextTemplate]);
    if (nextTemplate === "WELCOME") {
      setTitle("Welcome to Hamsa Lomi Ethiopian Association");
    }
  }

  function toggleChannel(channel: string) {
    setSelectedChannels((current) =>
      current.includes(channel) ? current.filter((item) => item !== channel) : [...current, channel]
    );
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_380px]">
      <Card className="space-y-6">
        <div>
          <label className="text-sm font-semibold text-gray-800" htmlFor="recipients">
            Recipients
          </label>
          <select
            className="mt-2 min-h-10 w-full rounded-md border border-gray-300 px-3 py-2"
            id="recipients"
            value={recipientMode}
            onChange={(event) => setRecipientMode(event.target.value)}
          >
            <option value="ALL">All Members</option>
            <option value="OVERDUE">Overdue Members</option>
            <option value="SPECIFIC">Specific Members</option>
          </select>
        </div>

        <fieldset>
          <legend className="text-sm font-semibold text-gray-800">Channels</legend>
          <div className="mt-3 grid gap-3 sm:grid-cols-4">
            {channels.map((channel) => (
              <label className="flex items-center gap-2 rounded-md border border-gray-300 px-3 py-2 text-sm" key={channel}>
                <input
                  checked={selectedChannels.includes(channel)}
                  onChange={() => toggleChannel(channel)}
                  type="checkbox"
                />
                {channel.replace("_", "-")}
              </label>
            ))}
          </div>
        </fieldset>

        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label className="text-sm font-semibold text-gray-800" htmlFor="template">
              Template
            </label>
            <select
              className="mt-2 min-h-10 w-full rounded-md border border-gray-300 px-3 py-2"
              id="template"
              value={template}
              onChange={(event) => applyTemplate(event.target.value as keyof typeof templates)}
            >
              {Object.keys(templates).map((key) => (
                <option key={key} value={key}>
                  {key.replaceAll("_", " ")}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-sm font-semibold text-gray-800" htmlFor="schedule">
              Schedule
            </label>
            <Input id="schedule" onChange={(event) => setScheduledFor(event.target.value)} type="datetime-local" value={scheduledFor} />
          </div>
        </div>

        <div>
          <label className="text-sm font-semibold text-gray-800" htmlFor="title">
            Title
          </label>
          <Input id="title" onChange={(event) => setTitle(event.target.value)} value={title} />
        </div>

        <div>
          <label className="text-sm font-semibold text-gray-800" htmlFor="body">
            Message Body
          </label>
          <Textarea id="body" onChange={(event) => setBody(event.target.value)} value={body} />
        </div>

        <div className="flex flex-wrap justify-end gap-3">
          <Button variant="secondary">Save draft</Button>
          <Button>Send notification</Button>
        </div>
      </Card>

      <aside className="space-y-4">
        <Card>
          <p className="text-sm font-semibold text-gray-500">Audience</p>
          <p className="mt-2 text-lg font-bold text-gray-950">{recipientMode.replace("_", " ")}</p>
          <p className="mt-1 text-sm text-gray-600">
            {scheduledFor ? "Queued for scheduled delivery." : "Ready to send immediately."}
          </p>
        </Card>
        <Card>
          <p className="text-sm font-semibold text-gray-500">Email preview</p>
          <h2 className="mt-3 text-lg font-bold text-gray-950">{title}</h2>
          <p className="mt-3 whitespace-pre-wrap text-sm text-gray-700">{body}</p>
        </Card>
        <Card>
          <p className="text-sm font-semibold text-gray-500">SMS preview</p>
          <p className="mt-3 text-sm text-gray-700">{smsPreview}</p>
          <p className="mt-3 text-xs text-gray-500">{smsPreview.length}/160 characters</p>
        </Card>
      </aside>
    </div>
  );
}
