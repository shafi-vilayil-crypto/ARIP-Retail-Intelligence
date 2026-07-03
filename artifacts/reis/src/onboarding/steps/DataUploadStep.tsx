import React, { useState } from "react";
import { useOnboardingStore } from "@/shared/stores/onboardingStore";
import { UPLOAD_DATA_TYPES } from "@/shared/lib/mockData";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import FileUploader from "../components/FileUploader";
import DataMappingWizard from "../components/DataMappingWizard";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { CheckCircle2, FileText, Settings, Trash2, HelpCircle } from "lucide-react";
import type { DataUpload } from "@/shared/types";

export default function DataUploadStep() {
  const { dataUploads, addDataUpload, removeDataUpload } = useOnboardingStore();
  const [selectedDataType, setSelectedDataType] = useState("outlet_list");
  const [activeUploadFile, setActiveUploadFile] = useState<{ name: string; size: number; format: any } | null>(null);
  const [isMapping, setIsMapping] = useState(false);

  const handleFileUploaded = (fileDetails: { name: string; size: number; format: any }) => {
    setActiveUploadFile(fileDetails);
    setIsMapping(true);
  };

  const handleMappingCompleted = (mapping: Record<string, string>) => {
    if (!activeUploadFile) return;

    const newUpload: DataUpload = {
      id: `up_${Date.now()}`,
      companyId: "c_temp",
      dataType: selectedDataType as any,
      fileName: activeUploadFile.name,
      fileSize: activeUploadFile.size,
      format: activeUploadFile.format,
      status: "validated",
      rowCount: 450,
      duplicateCount: 2,
      errorCount: 0,
      columnMapping: mapping,
      uploadedAt: new Date().toISOString()
    };

    addDataUpload(newUpload);
    setActiveUploadFile(null);
    setIsMapping(false);
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-bold text-foreground">Step 4 — Existing Company Data (Optional)</h3>
        <p className="text-xs text-muted-foreground">Upload your store locations, sales transactions, or catalogs to populate dashboards.</p>
      </div>

      {isMapping && activeUploadFile ? (
        <DataMappingWizard
          fileName={activeUploadFile.name}
          dataType={selectedDataType}
          onMapCompleted={handleMappingCompleted}
          onCancel={() => {
            setActiveUploadFile(null);
            setIsMapping(false);
          }}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="space-y-4 md:col-span-1 border-r border-border/80 pr-0 md:pr-6">
            <div className="space-y-1">
              <Label htmlFor="upload-type" className="text-sm font-semibold">Select Dataset Type</Label>
              <select
                id="upload-type"
                value={selectedDataType}
                onChange={(e) => setSelectedDataType(e.target.value)}
                className="w-full border border-input rounded-xl px-3 py-2 bg-background text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
              >
                {UPLOAD_DATA_TYPES.map((type) => (
                  <option key={type.value} value={type.value}>{type.label}</option>
                ))}
              </select>
            </div>
            <div className="p-4 bg-muted/30 border border-border/80 rounded-2xl">
              <div className="flex gap-2 text-xs text-muted-foreground leading-relaxed">
                <HelpCircle className="h-4.5 w-4.5 text-primary shrink-0" />
                <span>
                  {UPLOAD_DATA_TYPES.find((t) => t.value === selectedDataType)?.description}
                </span>
              </div>
            </div>
          </div>

          <div className="md:col-span-2 space-y-6">
            <FileUploader onFileUploaded={handleFileUploaded} />

            {/* Uploaded files list */}
            {dataUploads.length > 0 && (
              <div className="space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Successfully Prepared Imports</h4>
                <div className="border border-border/80 rounded-2xl overflow-hidden shadow-sm bg-card">
                  <Table>
                    <TableHeader className="bg-muted/10">
                      <TableRow>
                        <TableHead className="text-xs font-semibold py-3">Dataset</TableHead>
                        <TableHead className="text-xs font-semibold py-3">Filename</TableHead>
                        <TableHead className="text-xs font-semibold py-3 text-center">Status</TableHead>
                        <TableHead className="text-xs font-semibold py-3 text-right">Rows</TableHead>
                        <TableHead className="text-xs font-semibold py-3 text-center">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {dataUploads.map((up) => (
                        <TableRow key={up.id}>
                          <TableCell className="text-xs font-semibold whitespace-nowrap">
                            {UPLOAD_DATA_TYPES.find((t) => t.value === up.dataType)?.label || up.dataType}
                          </TableCell>
                          <TableCell className="text-xs text-muted-foreground truncate max-w-[140px]">{up.fileName}</TableCell>
                          <TableCell className="text-center">
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold score-excellent">
                              <CheckCircle2 className="h-3 w-3" /> Ready
                            </span>
                          </TableCell>
                          <TableCell className="text-xs text-right font-medium">{up.rowCount}</TableCell>
                          <TableCell className="text-center">
                            <button
                              onClick={() => removeDataUpload(up.id)}
                              className="p-1.5 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-lg transition-colors cursor-pointer"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
