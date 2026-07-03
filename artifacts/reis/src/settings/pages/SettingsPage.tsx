import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import CompanyTab from "../tabs/CompanyTab";
import BusinessTab from "../tabs/BusinessTab";
import ExpansionTab from "../tabs/ExpansionTab";
import CompetitorsTab from "../tabs/CompetitorsTab";
import DataManagementTab from "../tabs/DataManagementTab";
import AISettingsTab from "../tabs/AISettingsTab";
import UsersTab from "../tabs/UsersTab";
import IntegrationsTab from "../tabs/IntegrationsTab";
import { Settings } from "lucide-react";

export default function SettingsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between pb-2 border-b border-border">
        <div>
          <h2 className="text-xl font-bold text-foreground">Platform Settings</h2>
          <p className="text-xs text-muted-foreground">Manage your brand profile details, users, and AI intelligence integrations.</p>
        </div>
      </div>

      <div className="bg-card border border-border/80 rounded-3xl p-5 shadow-sm">
        <Tabs defaultValue="company" className="space-y-4">
          <TabsList className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-2 bg-muted/30 p-1.5 rounded-2xl h-auto overflow-x-auto max-w-full border border-border/60">
            <TabsTrigger value="company" className="text-xs font-semibold py-2 rounded-xl cursor-pointer">Profile</TabsTrigger>
            <TabsTrigger value="business" className="text-xs font-semibold py-2 rounded-xl cursor-pointer">Business</TabsTrigger>
            <TabsTrigger value="expansion" className="text-xs font-semibold py-2 rounded-xl cursor-pointer">Goals</TabsTrigger>
            <TabsTrigger value="competitors" className="text-xs font-semibold py-2 rounded-xl cursor-pointer">Rivals</TabsTrigger>
            <TabsTrigger value="data" className="text-xs font-semibold py-2 rounded-xl cursor-pointer">Datasets</TabsTrigger>
            <TabsTrigger value="ai" className="text-xs font-semibold py-2 rounded-xl cursor-pointer">AI settings</TabsTrigger>
            <TabsTrigger value="users" className="text-xs font-semibold py-2 rounded-xl cursor-pointer">Users</TabsTrigger>
            <TabsTrigger value="integrations" className="text-xs font-semibold py-2 rounded-xl cursor-pointer">APIs</TabsTrigger>
          </TabsList>

          <div className="pt-4 mt-2 border-t border-border/60">
            <TabsContent value="company"><CompanyTab /></TabsContent>
            <TabsContent value="business"><BusinessTab /></TabsContent>
            <TabsContent value="expansion"><ExpansionTab /></TabsContent>
            <TabsContent value="competitors"><CompetitorsTab /></TabsContent>
            <TabsContent value="data"><DataManagementTab /></TabsContent>
            <TabsContent value="ai"><AISettingsTab /></TabsContent>
            <TabsContent value="users"><UsersTab /></TabsContent>
            <TabsContent value="integrations"><IntegrationsTab /></TabsContent>
          </div>
        </Tabs>
      </div>
    </div>
  );
}
