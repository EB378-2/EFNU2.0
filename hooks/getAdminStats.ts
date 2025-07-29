// hooks/useProfileStats.ts
'use client';

import { useList } from "@refinedev/core";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import { useMemo } from "react";

dayjs.extend(utc);

export function useProfileStats() {
  const [startOfDay, endOfDay] = useMemo(() => {
    const start = dayjs().utc().startOf('day').format();
    const end = dayjs().utc().endOf('day').format();
    return [start, end];
  }, []);

  const { data: totalData } = useList({
    resource: "profiles",
    config: { pagination: { mode: "off" } },
    meta: { select: "count" },
  });

  const filters = useMemo(() => ([
    { field: "created_at", operator: "gte" as const, value: startOfDay },
    { field: "created_at", operator: "lte" as const, value: endOfDay },
  ]), [startOfDay, endOfDay]);

  const { data: todayData } = useList({
    resource: "profiles",
    filters,
  });

  return {
    totalCount: totalData?.total || 0,
    todayCount: todayData?.data?.length || 0,
  };
}


export function usePnApprovalsToCome() {
  const now = useMemo(() => dayjs().utc(), []);

  const filters = useMemo(() => ([
    { field: "status", operator: "eq" as const, value: "pending" },
    { field: "dof", operator: "gte" as const, value: now.format('YYYY-MM-DD') }
  ]), [now]);

  const { data: pendingFlightsData } = useList({
    resource: "priornotice",
    filters,
  });

  const pendingFutureFlights = useMemo(() => {
    return (pendingFlightsData?.data || []).filter(flight => {
      const flightDateTime = dayjs.utc(`${flight.arr_date} ${flight.arr_time}`, 'YYYY-MM-DD HHmm');
      return flightDateTime.isAfter(now);
    });
  }, [pendingFlightsData?.data, now]);

  return {
    PnApprovalsToCome: pendingFutureFlights.length,
  };
}


export function usePNStatsToday() {
  const [todayStart, now] = useMemo(() => {
    const start = dayjs().utc().startOf('day').format('YYYY-MM-DD');
    const current = dayjs().utc();
    return [start, current];
  }, []);

  const filters = useMemo(() => ([
    { field: "dof", operator: "eq" as const, value: todayStart },
    { field: "status", operator: "in" as const, value: ["approved", "pending"] }
  ]), [todayStart]);

  const { data: todaysFlightsData } = useList({
    resource: "priornotice",
    filters,
  });

  const upcomingFlights = useMemo(() => {
    return (todaysFlightsData?.data || []).filter(flight => {
      const flightDateTime = dayjs.utc(`${flight.dep_date} ${flight.dep_time}`, 'YYYY-MM-DD HHmm');
      return flightDateTime.isAfter(now);
    });
  }, [todaysFlightsData?.data, now]);

  return {
    TodaysApprovedPendingFlights: todaysFlightsData?.data?.length || 0,
    UpcomingFlightsCount: upcomingFlights.length,
  };
}


export function useRecentIncidents() {
  const oneWeekAgo = useMemo(() =>
    dayjs().utc().subtract(1, 'week').format('YYYY-MM-DD HH:mm:ss.SSSSSS[+00]'),
  []);

  const filters = useMemo(() => ([
    {
      field: "reported_at",
      operator: "gte" as const,
      value: oneWeekAgo,
    },
  ]), [oneWeekAgo]);

  const { data } = useList({
    resource: "sms",
    filters,
  });

  return {
    recentIncidentsCount: data?.data?.length || 0,
  };
}
