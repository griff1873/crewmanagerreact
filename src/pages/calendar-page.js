import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import React, { useState } from "react";
import { PageLayout } from "../components/page-layout";

export const CalendarPage = () => {
  return (
    <PageLayout>
      <FullCalendar
        plugins={[dayGridPlugin]}
        initialView="dayGridMonth"
      />
    </PageLayout>
  );
};