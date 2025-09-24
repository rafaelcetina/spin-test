import React from 'react'

export const ResponsiveContainer = ({ children }: { children: React.ReactNode }) => (
  <div data-testid="responsive-container">{children}</div>
)

export const LineChart = ({ children }: { children: React.ReactNode }) => (
  <div data-testid="line-chart">{children}</div>
)

export const Line = () => <div data-testid="line" />
export const XAxis = () => <div data-testid="x-axis" />
export const YAxis = () => <div data-testid="y-axis" />
export const CartesianGrid = () => <div data-testid="cartesian-grid" />
export const Tooltip = () => <div data-testid="tooltip" />
