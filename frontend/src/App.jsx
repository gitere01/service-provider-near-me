import React, { useState } from "react";
import { QueryClient, QueryClientProvider } from "react-query";
import { Routes, Route } from "react-router-dom";
import { LikedSkillsProvider } from "./components/LikedSkillsContext"; // Import the provider

import {
  SignUp,
  Login,
  Homepage,
  AddSkillPage,
  CategoryPage,
  SubscribePage,
  FetchSkillPage,
  UpdateSkillPage,
  ProfilePage,
  ItemDetail,
  Contact,
  AdminDashboard,
  ManageUsers,
  ManageSubscriptions,
  AdminLogin,
  Privacypage
} from "./pages";

const queryClient = new QueryClient();

function App() {
  const [token, setToken] = useState(null);

  return (
    <LikedSkillsProvider> {/* Wrap your app with the LikedSkillsProvider */}
      <QueryClientProvider client={queryClient}>
        <Routes>
          {/* Corrected routes */}
          <Route path="/" element={<CategoryPage />} />
          <Route path="/home" element={<Homepage />} />
          <Route path="/category/:categoryId" element={<Homepage />} />{" "}
          {/* Category route */}
          <Route path="/signup" element={<SignUp />} />
          <Route path="/addskill" element={<AddSkillPage />} />
          <Route path="/fetchskill" element={<FetchSkillPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/privacy" element={<Privacypage />} />
          <Route path="/update/:skillId" element={<UpdateSkillPage />} />
          <Route path="/details/:skill_id" element={<ItemDetail />} />
          <Route path="/subscribe" element={<SubscribePage />} />
          <Route path="/login" element={<Login setToken={setToken} />} />
          <Route path="/contact" element={<Contact />} />
          {/* Admin routes */}
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/admin/users" element={<ManageUsers />} />
          <Route path="/admin/subscriptions" element={<ManageSubscriptions />} />
        </Routes>
      </QueryClientProvider>
    </LikedSkillsProvider>
  );
}

export default App;
