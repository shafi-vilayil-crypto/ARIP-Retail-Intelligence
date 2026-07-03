import React from "react";
import { useCompanyStore } from "@/shared/stores/companyStore";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function CompanyTab() {
  const { activeCompany, updateCompany } = useCompanyStore();

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
  };

  return (
    <form onSubmit={handleSave} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-1">
          <Label htmlFor="c-name">Company Name</Label>
          <Input
            id="c-name"
            value={activeCompany?.name || ""}
            onChange={(e) => updateCompany({ name: e.target.value })}
            className="rounded-xl"
          />
        </div>
        <div className="space-y-1">
          <Label htmlFor="c-website">Website</Label>
          <Input
            id="c-website"
            value={activeCompany?.website || ""}
            onChange={(e) => updateCompany({ website: e.target.value })}
            placeholder="https://company.com"
            className="rounded-xl"
          />
        </div>
        <div className="space-y-1">
          <Label htmlFor="c-hq">Headquarters</Label>
          <Input
            id="c-hq"
            value={activeCompany?.headquarters || ""}
            onChange={(e) => updateCompany({ headquarters: e.target.value })}
            className="rounded-xl"
          />
        </div>
        <div className="space-y-1">
          <Label htmlFor="c-cat">Business Category</Label>
          <Input
            id="c-cat"
            value={activeCompany?.businessCategory || ""}
            onChange={(e) => updateCompany({ businessCategory: e.target.value })}
            className="rounded-xl"
          />
        </div>
      </div>
      <Button type="submit" className="bg-primary text-primary-foreground hover:bg-primary/95 rounded-xl cursor-pointer">
        Save Company Settings
      </Button>
    </form>
  );
}
