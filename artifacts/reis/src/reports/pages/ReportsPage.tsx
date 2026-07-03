import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { FileText, Download, Play, RefreshCw } from "lucide-react";
import { mockReports } from "@/shared/lib/mockData";

export default function ReportsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between pb-2 border-b border-border">
        <div>
          <h2 className="text-xl font-bold text-foreground">Generated Reports</h2>
          <p className="text-xs text-muted-foreground">Download board presentations, operations summary and regional forecasts sheets.</p>
        </div>
        <Button size="sm" variant="outline" className="rounded-xl flex gap-1 cursor-pointer">
          <RefreshCw className="h-3.5 w-3.5" /> Sync Reports
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-4">
          <h3 className="text-xs font-bold text-foreground uppercase tracking-wider">Reports Library</h3>
          <div className="border border-border/80 rounded-2xl overflow-hidden shadow-sm bg-card">
            <Table>
              <TableHeader className="bg-muted/10">
                <TableRow>
                  <TableHead className="text-xs font-semibold py-3">Report Description</TableHead>
                  <TableHead className="text-xs font-semibold py-3 text-center">Status</TableHead>
                  <TableHead className="text-xs font-semibold py-3 text-right">Date</TableHead>
                  <TableHead className="text-xs font-semibold py-3 text-center">Download</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mockReports.map((report) => (
                  <TableRow key={report.id}>
                    <TableCell className="py-3">
                      <div className="flex items-center gap-2">
                        <FileText className="h-4 w-4 text-primary shrink-0" />
                        <div>
                          <div className="text-xs font-bold text-foreground">{report.title}</div>
                          <div className="text-[10px] text-muted-foreground mt-0.5">{report.description}</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="text-center">
                      <span className={`inline-flex px-2 py-0.5 rounded-full text-[9px] font-bold ${
                        report.status === "ready"
                          ? "bg-emerald-100 text-emerald-800"
                          : "bg-blue-100 text-blue-800 animate-pulse"
                      }`}>
                        {report.status}
                      </span>
                    </TableCell>
                    <TableCell className="text-right text-xs text-muted-foreground whitespace-nowrap">
                      {new Date(report.createdAt).toLocaleDateString([], { day: "numeric", month: "short", year: "numeric" })}
                    </TableCell>
                    <TableCell className="text-center">
                      {report.status === "ready" ? (
                        <Button size="icon" variant="ghost" className="h-8 w-8 rounded-lg text-primary hover:bg-primary/10 cursor-pointer">
                          <Download className="h-4 w-4" />
                        </Button>
                      ) : (
                        <span className="text-[10px] text-muted-foreground font-semibold">Generating...</span>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-xs font-bold text-foreground uppercase tracking-wider">Create Custom Report</h3>
          <Card className="bg-card border border-border/80 rounded-3xl shadow-sm p-5 space-y-4">
            <p className="text-xs text-muted-foreground leading-relaxed">
              Synthesize custom data segments (e.g. Maharashtra Sites list, Mumbai Inventory Health) into dynamic board-ready PDF formats.
            </p>
            <Button className="w-full bg-primary text-primary-foreground hover:bg-primary/95 rounded-xl flex gap-1.5 justify-center cursor-pointer shadow-sm">
              <Play className="h-4 w-4 fill-current" /> Compile custom synthesis
            </Button>
          </Card>
        </div>
      </div>
    </div>
  );
}
