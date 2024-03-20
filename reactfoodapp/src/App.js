

import{
  BrowserRouter as Router,
  Routes,
  Route,
}from "react-router-dom"
import Navigate from "react"
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "./Pages/Home";
import MyFridge from "./Pages/MyFridge";
import Settings from "./Pages/Settings";
import Makeameal from "./Pages/Makeameal";
import Targets from "./Pages/Targets";
import Profile from "./Pages/Profile";
import TypesOfMeals from "./Pages/TypesOfMeals";
import TypeOfDesserts from "./Pages/TypeOfDesserts";
import YourTargets from "./Pages/YourTargets";
import AllTargets from "./Pages/AllTargets";
import AdvancedTargets from "./Pages/AdvancedTargets";
import JournalEntry from "./components/JournalEntry";
import Register from "./components/Register";
import ProductView from './Pages/ProductView';
//import Login from "./components/Login";
// import Register from "./components/Register";
import React, { useState,useEffect } from "react";
import Login from "./components/Login";
import { Link } from "react-router-dom";
import { useLocation } from "react-router-dom";
import Layout from './Layout';
import ReviewForm from "./Pages/ReviewForm";
import MealsPage from "./Pages/MealsPage";
import MealCard from "./Pages/MealCard";
import MealView from "./Pages/MealView";
import MealsPageBudget from  "./Pages/MealsPageBudget";
import MealCardBudget from "./Pages/MealCardBudget";
import RecommendedMeals from "./Pages/RecommendedMeals";
import DessertView from "./Pages/DessertView";
import DessertsPage from "./Pages/DessertsPage";
import DessertsPageBudget from "./Pages/DessertsPageBudget";
import RecommendedDesserts from "./Pages/RecommendedDesserts";
import ReviewCard from "./components/ReviewCard";
import ProductSuggestion from "./Pages/ProductSuggestion";
function App() {
  const journalEntries = [
    { id: 1, text: "Entry 1" },
    { id: 2, text: "Entry 2" },
    { id: 3, text: "Entry 3" },
  ];
  return (
    <Router>
      {/* {isNavbarAndFooterVisible && <Navbar />} */}
    <Layout>
      <div className="container main">
        <Routes>
          <Route
            path="/home"
            element={ <Home />}
            isLoginPage="/home"
            isRegisterPage="/home"
            
          />
          <Route
            path="/myfridge"
            element={ <MyFridge />}
            isLoginPage="/myfridge"
          />
          <Route
            path="/makeameal"
            element={ <Makeameal />}
            isLoginPage="/makeameal"
          />
          <Route
            path="/targets"
            element={<Targets />}
            isLoginPage="/targets"
          />
          <Route
            path="/profile"
            element={ <Profile />}
            isLoginPage="/profile"
          />
          <Route
            path="/settings"
            element={<Settings />}
            isLoginPage="/settings"
          />
          <Route
            path="/typesofmeals"
            element={<TypesOfMeals />}
            isLoginPage="/typesofmeals"
          />
          <Route
            path="/typeofdesserts"
            element={ <TypeOfDesserts />}
            isLoginPage="/typeofdesserts"
          />
          <Route
            path="/yourtargets"
            element={ <YourTargets />}
            isLoginPage="/yourtargets"
          />
          <Route
            path="/alltargets"
            element={ <AllTargets />}
            isLoginPage="/alltargets"
          />
          <Route
            path="/advancedtargets"
            element={ <AdvancedTargets />}
            isLoginPage="/advancedtargets"
          />
          <Route
            path="/"
            element={<Login />}
          />
          <Route
          path="/register"
          element={<Register/>}
          />
           
           <Route path="/reviewForm"
            element={<ReviewForm />}
          />
          
           <Route path="/product/:id"
            element={<ProductView />}
          />
           <Route path="/mealsPage"
            element={<MealsPage />}
          />
           <Route path="/mealsCard"
            element={<MealCard />}
          />
            <Route path="/meal/:id"
            element={<MealView />}
          />
           <Route path="/mealsPageBudget"
            element={<MealsPageBudget />}
          />
           <Route path="/mealCardBudget"
            element={<MealCardBudget />}
          />
           <Route path="/recommendedMeals"
            element={<RecommendedMeals />}
          />
          <Route path="/dessert/:id"
            element={<DessertView />}
          />
           <Route path="/dessertPage"
            element={<DessertsPage />}
          />
           <Route path="/dessertPageBudget"
            element={<DessertsPageBudget />}
          />
           <Route path="/recommendedDesserts"
            element={<RecommendedDesserts />}
          />
            <Route path="/reviewCard"
            element={<ReviewCard />}
          />
           <Route path="/productSuggestion"
            element={<ProductSuggestion />}
          />
        </Routes>
      </div>
      {/* {isNavbarAndFooterVisible && <Footer />}  */}
      </Layout>
    
    </Router>
  );
}

export default App;
