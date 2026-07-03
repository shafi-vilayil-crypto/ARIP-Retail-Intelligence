import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Check, AlertCircle } from "lucide-react";

interface DataMappingWizardProps {
  fileName: string;
  dataType: string;
  onMapCompleted: (mapping: Record<string, string>) => void;
  onCancel: () => void;
}

const SCHEMA_FIELDS_BY_TYPE: Record<string, Array<{ name: string; required: boolean; label: string }>> = {
  outlet_list: [
    { name: "outlet_name", required: true, label: "Store Name" },
    { name: "city", required: true, label: "City" },
    { name: "state", required: true, label: "State" },
    { name: "latitude", required: false, label: "Latitude" },
    { name: "longitude", required: false, label: "Longitude" },
    { name: "monthly_rent", required: false, label: "Monthly Rent" }
  ],
  sales_history: [
    { name: "transaction_id", required: true, label: "Transaction ID" },
    { name: "outlet_id", required: true, label: "Outlet ID" },
    { name: "date", required: true, label: "Transaction Date" },
    { name: "amount", required: true, label: "Sale Amount" }
  ]
};

const MOCK_CSV_HEADERS = ["OutletID", "Store_Name", "City_Location", "Region_State", "Lat", "Lng", "MonthlyRent_INR"];

const MOCK_CSV_ROWS = [
  ["OUT-001", "FreshMart Bandra", "Mumbai", "Maharashtra", "19.05", "72.82", "120000"],
  ["OUT-002", "FreshMart Koramangala", "Bangalore", "Karnataka", "12.93", "77.62", "95000"],
  ["OUT-003", "FreshMart Adyar", "Chennai", "Tamil Nadu", "13.00", "80.25", "85000"]
];

export default function DataMappingWizard({ fileName, dataType, onMapCompleted, onCancel }: DataMappingWizardProps) {
  const fields = SCHEMA_FIELDS_BY_TYPE[dataType] || [
    { name: "name", required: true, label: "Name" },
    { name: "location", required: false, label: "Location" }
  ];

  // Auto-map headers
  const initialMapping: Record<string, string> = {};
  fields.forEach((field) => {
    const match = MOCK_CSV_HEADERS.find(
      (header) =>
        header.toLowerCase().includes(field.name.toLowerCase()) ||
        field.name.toLowerCase().includes(header.toLowerCase())
    );
    if (match) {
      initialMapping[field.name] = match;
    }
  });

  const [mapping, setMapping] = useState<Record<string, string>>(initialMapping);

  const handleSelectChange = (fieldName: string, value: string) => {
    setMapping((prev) => ({
      ...prev,
      [fieldName]: value
    }));
  };

  const handleSave = () => {
    onMapCompleted(mapping);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h4 className="text-sm font-bold text-foreground">Column Mapping Wizard</h4>
          <p className="text-xs text-muted-foreground">Map columns from {fileName} to database schema.</p>
        </div>
        <Button variant="ghost" size="sm" onClick={onCancel} className="text-xs cursor-pointer">Cancel</Button>
      </div>

      {/* Mapping grid */}
      <div className="border border-border/80 rounded-2xl overflow-hidden bg-card p-4 space-y-4 shadow-sm">
        <h5 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Schema Field Alignment</h5>
        <div className="space-y-3">
          {fields.map((field) => {
            const currentMapped = mapping[field.name];
            return (
              <div key={field.name} className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 border border-border/80 rounded-xl bg-muted/10">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold text-foreground">{field.label}</span>
                  {field.required && <span className="text-xs text-destructive font-bold">* Required</span>}
                </div>
                <div className="flex items-center gap-2">
                  <select
                    value={currentMapped || ""}
                    onChange={(e) => handleSelectChange(field.name, e.target.value)}
                    className="border border-input rounded-xl px-3 py-2 bg-background text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 min-w-[180px]"
                  >
                    <option value="">-- Ignore column --</option>
                    {MOCK_CSV_HEADERS.map((header) => (
                      <option key={header} value={header}>{header}</option>
                    ))}
                  </select>
                  {currentMapped ? (
                    <span className="h-6 w-6 rounded-full bg-emerald-100 dark:bg-emerald-950/40 text-emerald-600 flex items-center justify-center">
                      <Check className="h-3.5 w-3.5" />
                    </span>
                  ) : (
                    field.required && (
                      <span className="h-6 w-6 rounded-full bg-destructive/10 text-destructive flex items-center justify-center" title="Required field mapping missing">
                        <AlertCircle className="h-3.5 w-3.5" />
                      </span>
                    )
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Dataset Preview */}
      <div className="space-y-2">
        <h5 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Data Import Preview</h5>
        <div className="border border-border rounded-xl overflow-x-auto custom-scrollbar">
          <Table>
            <TableHeader className="bg-muted/30">
              <TableRow>
                {MOCK_CSV_HEADERS.map((h) => (
                  <TableHead key={h} className="text-xs font-semibold py-3 whitespace-nowrap">{h}</TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {MOCK_CSV_ROWS.map((row, idx) => (
                <TableRow key={idx}>
                  {row.map((cell, cidx) => (
                    <TableCell key={cidx} className="text-xs text-muted-foreground whitespace-nowrap">{cell}</TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>

      <div className="flex justify-end gap-3">
        <Button variant="outline" className="rounded-xl cursor-pointer" onClick={onCancel}>Cancel</Button>
        <Button className="bg-primary text-primary-foreground hover:bg-primary/95 rounded-xl cursor-pointer" onClick={handleSave}>
          Confirm & Map Columns
        </Button>
      </div>
    </div>
  );
}
