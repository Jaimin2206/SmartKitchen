import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function SmartKitchenDashboard() {
  const [inventory, setInventory] = useState([]);
  const [spoilage, setSpoilage] = useState(null);
  const [forecast, setForecast] = useState([]);
  const [image, setImage] = useState(null);
  const [wasteLog, setWasteLog] = useState([]);
  const [recipes, setRecipes] = useState([]);
  const [menuSuggestion, setMenuSuggestion] = useState([]);

  // Handle image upload and communication with backend
  const handleImageUpload = async (endpoint) => {
    if (!image) return;

    const formData = new FormData();
    formData.append('file', image);

    try {
      const res = await fetch(`http://localhost:8000/${endpoint}`, {
        method: 'POST',
        body: formData,
      });

      if (!res.ok) {
        throw new Error('Failed to upload image');
      }

      const data = await res.json();

      if (endpoint === 'detect') setInventory(data.items);
      else if (endpoint === 'spoilage') setSpoilage(data.spoiled);
      else if (endpoint === 'waste') setWasteLog(data.log);
    } catch (error) {
      console.error(error);
      alert('An error occurred during the image upload process.');
    }
  };

  // Get forecasted demand
  const getForecast = async () => {
    try {
      const res = await fetch('http://localhost:8000/forecast');
      const data = await res.json();
      setForecast(data);
    } catch (error) {
      console.error(error);
      alert('Failed to load forecast data');
    }
  };

  // Get recipes suggestions
  const getRecipes = async () => {
    try {
      const res = await fetch('http://localhost:8000/recipes');
      const data = await res.json();
      setRecipes(data);
    } catch (error) {
      console.error(error);
      alert('Failed to load recipes');
    }
  };

  // Get menu suggestions
  const getMenuSuggestion = async () => {
    try {
      const res = await fetch('http://localhost:8000/menu-suggestions');
      const data = await res.json();
      setMenuSuggestion(data);
    } catch (error) {
      console.error(error);
      alert('Failed to load menu suggestions');
    }
  };

  return (
    <div className="p-6 grid gap-6">
      <h1 className="text-3xl font-bold">AI Smart Kitchen Dashboard</h1>

      {/* Image upload */}
      <Card>
        <CardContent className="p-4">
          <h2 className="text-xl font-semibold mb-2">Upload Image</h2>
          <input type="file" onChange={(e) => setImage(e.target.files[0])} />
          <div className="flex flex-wrap gap-2 mt-3">
            <Button onClick={() => handleImageUpload('detect')}>Detect Inventory</Button>
            <Button onClick={() => handleImageUpload('spoilage')}>Check Spoilage</Button>
            <Button onClick={() => handleImageUpload('waste')}>Analyze Waste</Button>
          </div>
        </CardContent>
      </Card>

      {/* Inventory items */}
      <Card>
        <CardContent className="p-4">
          <h2 className="text-xl font-semibold mb-2">Inventory Items</h2>
          <ul className="list-disc ml-5">
            {inventory.length ? (
              inventory.map((item, idx) => <li key={idx}>{item}</li>)
            ) : (
              <li>No inventory data available</li>
            )}
          </ul>
        </CardContent>
      </Card>

      {/* Spoilage check */}
      <Card>
        <CardContent className="p-4">
          <h2 className="text-xl font-semibold mb-2">Spoilage Check</h2>
          <p className={spoilage === null ? "text-gray-600" : spoilage ? "text-red-500" : "text-green-600"}>
            {spoilage === null ? "Upload image to check." : spoilage ? "Spoiled items detected." : "No spoilage found."}
          </p>
        </CardContent>
      </Card>

      {/* Forecast demand */}
      <Card>
        <CardContent className="p-4">
          <h2 className="text-xl font-semibold mb-2">Forecasted Demand</h2>
          <Button onClick={getForecast}>Load Forecast</Button>
          <ul className="list-disc ml-5 mt-2">
            {forecast.length ? (
              forecast.map((item, idx) => (
                <li key={idx}>{item.ds}: {Math.round(item.yhat)}</li>
              ))
            ) : (
              <li>No forecast data available</li>
            )}
          </ul>
        </CardContent>
      </Card>

      {/* Waste analysis */}
      <Card>
        <CardContent className="p-4">
          <h2 className="text-xl font-semibold mb-2">Waste Analysis</h2>
          <ul className="list-disc ml-5">
            {wasteLog.length ? (
              wasteLog.map((log, idx) => (
                <li key={idx}>{log.category}: {log.amount}kg</li>
              ))
            ) : (
              <li>No waste analysis data available</li>
            )}
          </ul>
        </CardContent>
      </Card>

      {/* Recipe suggestions */}
      <Card>
        <CardContent className="p-4">
          <h2 className="text-xl font-semibold mb-2">AI Recipe Suggestions</h2>
          <Button onClick={getRecipes}>Generate Recipes</Button>
          <ul className="list-disc ml-5 mt-2">
            {recipes.length ? (
              recipes.map((recipe, idx) => <li key={idx}>{recipe}</li>)
            ) : (
              <li>No recipe suggestions available</li>
            )}
          </ul>
        </CardContent>
      </Card>

      {/* Menu suggestions */}
      <Card>
        <CardContent className="p-4">
          <h2 className="text-xl font-semibold mb-2">Menu Optimization</h2>
          <Button onClick={getMenuSuggestion}>Suggest Menu</Button>
          <ul className="list-disc ml-5 mt-2">
            {menuSuggestion.length ? (
              menuSuggestion.map((dish, idx) => <li key={idx}>{dish}</li>)
            ) : (
              <li>No menu suggestions available</li>
            )}
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
