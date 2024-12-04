'use client'

import {Cell, Pie, PieChart, ResponsiveContainer, Tooltip} from "recharts";
import React from "react";


interface PieCharProps {
    data: PieDataType[];
}

export interface PieDataType {
    name: string,
    value: number
}

interface LabelType {
    cx: number,
    cy: number,
    midAngle: number,
    innerRadius: number,
    outerRadius: number,
    percent: number
}

const COLORS = ['#FF8042', '#00C49F'];
const RADIAN = Math.PI / 180;


const renderCustomizedLabel = ({cx, cy, midAngle, innerRadius, outerRadius, percent}: LabelType) => {
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);
    return (
        <text x={x} y={y} fontSize="8px" fill="white" textAnchor="middle" dominantBaseline="central">
            {`${(percent * 100).toFixed(0)}%`}
        </text>
    );
};

const PieChartComp: React.FC<PieCharProps> = ({data}) => {
    return (
        <div className='flex flex-col items-center'>
            <div className="sm:w-[24px] sm:h-[24px]">
                <ResponsiveContainer width="100%" height="100%">
                    <PieChart width={24} height={24}>
                        <Tooltip/>
                        <Pie
                            data={data}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            // label={renderCustomizedLabel}
                            outerRadius={12}
                            fill="#8884d8"
                            dataKey="value"
                        >
                            {data.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]}/>
                            ))}
                        </Pie>
                    </PieChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};

export default PieChartComp;


