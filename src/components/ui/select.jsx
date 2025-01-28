// src/components/ui/select.js
import React from 'react';

export const Select = ({ options, onChange, value }) => (
  <select
    className="border rounded px-2 py-1"
    value={value}
    onChange={onChange}
  >
    {options?.map((option) => (
      <option key={option.value} value={option.value}>
        {option.label}
      </option>
    ))}
  </select>
);
