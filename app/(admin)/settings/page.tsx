import React from "react";

// UI
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import AccountClient from "./components/account";
import { getData } from "./(actions)/action";
import NotificationsClient from "./components/notifications";

const SettingsPage = async () => {
  const currentUser = await getData();
  return (
    <div className="flex-1">
      <div className="container mx-auto w-full h-full relative pb-4">
        <Tabs defaultValue="account" className="w-full h-full">
          <TabsList>
            <TabsTrigger value="account">Account</TabsTrigger>
            <TabsTrigger value="notifications">Notifications</TabsTrigger>
          </TabsList>
          <TabsContent value="account">
            <AccountClient currentUser={currentUser!!} />
          </TabsContent>
          <TabsContent value="notifications">
            <NotificationsClient currentUser={currentUser!!} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default SettingsPage;
