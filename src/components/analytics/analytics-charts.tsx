"use client";

import {
  Bar,
  CartesianGrid,
  Cell,
  ComposedChart,
  Legend,
  Line,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const AXIS_PROPS = {
  stroke: "var(--muted-foreground)",
  fontSize: 12,
  tickLine: false,
  axisLine: false,
} as const;

type TooltipEntry = {
  name?: string;
  value?: number | string;
  color?: string;
  fill?: string;
  dataKey?: string | number;
};

function ChartTooltip({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: TooltipEntry[];
  label?: string;
}) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-md border bg-popover px-3 py-2 text-xs shadow-md">
      {label && <p className="mb-1 font-medium text-popover-foreground">{label}</p>}
      {payload.map((entry) => (
        <p
          key={String(entry.dataKey ?? entry.name)}
          className="flex items-center gap-2 text-muted-foreground"
        >
          <span
            className="size-2 rounded-full"
            style={{ background: entry.color ?? entry.fill }}
          />
          {entry.name}:{" "}
          <span className="font-medium text-popover-foreground">
            {entry.value}
          </span>
        </p>
      ))}
    </div>
  );
}

export function CompletionTrendChart({
  data,
}: {
  data: { date: string; completed: number; created: number }[];
}) {
  return (
    <ResponsiveContainer width="100%" height={260}>
      <ComposedChart data={data} margin={{ top: 8, right: 8, bottom: 0, left: -18 }}>
        <CartesianGrid vertical={false} stroke="var(--border)" strokeDasharray="3 3" />
        <XAxis dataKey="date" interval={1} {...AXIS_PROPS} />
        <YAxis allowDecimals={false} width={28} {...AXIS_PROPS} />
        <Tooltip
          content={<ChartTooltip />}
          cursor={{ fill: "var(--muted)", opacity: 0.4 }}
        />
        <Bar
          dataKey="completed"
          name="Completed"
          fill="var(--chart-1)"
          radius={[4, 4, 0, 0]}
          maxBarSize={20}
        />
        <Line
          dataKey="created"
          name="Created"
          type="monotone"
          stroke="var(--chart-2)"
          strokeWidth={2}
          dot={false}
        />
      </ComposedChart>
    </ResponsiveContainer>
  );
}

export function PriorityPieChart({
  data,
}: {
  data: { label: string; count: number; color: string }[];
}) {
  return (
    <ResponsiveContainer width="100%" height={260}>
      <PieChart>
        <Pie
          data={data}
          dataKey="count"
          nameKey="label"
          innerRadius={56}
          outerRadius={90}
          paddingAngle={2}
          strokeWidth={0}
        >
          {data.map((entry) => (
            <Cell key={entry.label} fill={entry.color} />
          ))}
        </Pie>
        <Tooltip content={<ChartTooltip />} />
        <Legend
          verticalAlign="bottom"
          height={24}
          iconType="circle"
          formatter={(value) => (
            <span className="text-xs text-muted-foreground">{value}</span>
          )}
        />
      </PieChart>
    </ResponsiveContainer>
  );
}
