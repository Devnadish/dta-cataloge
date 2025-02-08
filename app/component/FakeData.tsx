"use client";
import React from "react";
import { Button } from "../../components/ui/button";
import { seedDatabase } from "../../script/fakedata";

function FakeData() {
  const seedData = async () => {
    await seedDatabase();
  };
  return <Button onClick={seedData}>seed</Button>;
}

export default FakeData;
