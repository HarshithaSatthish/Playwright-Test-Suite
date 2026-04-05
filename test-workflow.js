#!/usr/bin/env node

/**
 * Complete Workflow Test Script
 * Tests: Login → Form Creation → PDF Upload → File Download → File Deletion
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const BASE_URL = "http://localhost:3001";
const DEMO_USER = "harshitha";
const DEMO_PASS = "harshitha21";
const SAMPLE_PDF = path.join(__dirname, "test-data", "sample-upload.pdf");

let token = "";
let uploadedFileId = "";

async function log(message, type = "info") {
  const colors = {
    info: "\x1b[36m",
    success: "\x1b[32m",
    error: "\x1b[31m",
    warning: "\x1b[33m",
    reset: "\x1b[0m",
  };
  console.log(`${colors[type] || colors.info}[${type.toUpperCase()}]${colors.reset} ${message}`);
}

async function test(name, fn) {
  try {
    log(`Testing: ${name}`, "info");
    await fn();
    log(`✓ ${name} passed`, "success");
    return true;
  } catch (err) {
    log(`✗ ${name} failed: ${err.message}`, "error");
    return false;
  }
}

async function runTests() {
  log("=== Automation Anywhere Demo - Complete Workflow Test ===", "info");
  log(`Base URL: ${BASE_URL}`, "info");
  log("", "info");

  let passed = 0;
  let failed = 0;

  // Test 1: Login
  if (
    await test("Authentication - Login with valid credentials", async () => {
      const res = await fetch(`${BASE_URL}/v2/authentication`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: DEMO_USER, password: DEMO_PASS }),
      });

      if (!res.ok) throw new Error(`Status ${res.status}`);
      const data = await res.json();
      if (!data.token) throw new Error("No token in response");
      token = data.token;
    })
  ) {
    passed++;
  } else {
    failed++;
  }

  // Test 2: Invalid Login
  if (
    await test("Authentication - Reject invalid credentials", async () => {
      const res = await fetch(`${BASE_URL}/v2/authentication`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: "wrong", password: "wrong" }),
      });

      if (res.ok) throw new Error("Should have rejected invalid credentials");
    })
  ) {
    passed++;
  } else {
    failed++;
  }

  // Test 3: Form Save
  if (
    await test("Form - Save form successfully", async () => {
      const res = await fetch(`${BASE_URL}/api/form/save`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ formName: "TestForm" }),
      });

      if (!res.ok) throw new Error(`Status ${res.status}`);
      const data = await res.json();
      if (data.status !== "ok") throw new Error("Form save failed");
    })
  ) {
    passed++;
  } else {
    failed++;
  }

  // Test 4: Task Bot Save
  if (
    await test("Task Bot - Save task bot successfully", async () => {
      const res = await fetch(`${BASE_URL}/api/taskbot/save`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ botName: "TestBot" }),
      });

      if (!res.ok) throw new Error(`Status ${res.status}`);
      const data = await res.json();
      if (data.status !== "ok") throw new Error("Task bot save failed");
    })
  ) {
    passed++;
  } else {
    failed++;
  }

  // Test 5: File Upload
  if (
    await test("File Upload - Upload PDF file successfully", async () => {
      if (!fs.existsSync(SAMPLE_PDF)) {
        throw new Error(`Sample PDF not found at ${SAMPLE_PDF}`);
      }

      const formData = new FormData();
      const fileBuffer = fs.readFileSync(SAMPLE_PDF);
      const blob = new Blob([fileBuffer], { type: "application/pdf" });
      formData.append("file", blob, "sample-upload.pdf");

      const res = await fetch(`${BASE_URL}/api/file/upload`, {
        method: "POST",
        body: formData,
      });

      if (!res.ok) throw new Error(`Status ${res.status}`);
      const data = await res.json();
      if (data.status !== "ok") throw new Error("Upload failed");
      if (!data.file?.id) throw new Error("No file ID in response");
      uploadedFileId = data.file.id;
    })
  ) {
    passed++;
  } else {
    failed++;
  }

  // Test 6: List Files
  if (
    await test("File List - Retrieve uploaded files", async () => {
      const res = await fetch(`${BASE_URL}/api/file/list`);
      if (!res.ok) throw new Error(`Status ${res.status}`);
      const data = await res.json();
      if (data.status !== "ok") throw new Error("List failed");
      if (!Array.isArray(data.files)) throw new Error("Files not an array");
      if (data.files.length === 0) throw new Error("No files in list");
    })
  ) {
    passed++;
  } else {
    failed++;
  }

  // Test 7: Download File
  if (
    await test("File Download - Download uploaded PDF", async () => {
      if (!uploadedFileId) throw new Error("No uploaded file ID");

      const res = await fetch(`${BASE_URL}/api/file/download/${uploadedFileId}`);
      if (!res.ok) throw new Error(`Status ${res.status}`);

      const buffer = await res.arrayBuffer();
      const view = new Uint8Array(buffer);
      if (view.length === 0) throw new Error("Downloaded file is empty");
      const header = String.fromCharCode(...view.slice(0, 4));
      if (!header.includes("%PDF")) {
        throw new Error("Downloaded file is not a valid PDF");
      }
    })
  ) {
    passed++;
  } else {
    failed++;
  }

  // Test 8: Delete File
  if (
    await test("File Delete - Delete uploaded file", async () => {
      if (!uploadedFileId) throw new Error("No uploaded file ID");

      const res = await fetch(`${BASE_URL}/api/file/delete/${uploadedFileId}`, {
        method: "DELETE",
      });

      if (!res.ok) throw new Error(`Status ${res.status}`);
      const data = await res.json();
      if (data.status !== "ok") throw new Error("Delete failed");
    })
  ) {
    passed++;
  } else {
    failed++;
  }

  // Test 9: Verify File Deleted
  if (
    await test("File Verification - Confirm file was deleted", async () => {
      const res = await fetch(`${BASE_URL}/api/file/list`);
      if (!res.ok) throw new Error(`Status ${res.status}`);
      const data = await res.json();
      if (data.files.length !== 0) throw new Error("File still exists after deletion");
    })
  ) {
    passed++;
  } else {
    failed++;
  }

  // Test 10: Learning Instance Creation
  if (
    await test("Learning Instance - Create with authentication", async () => {
      const res = await fetch(`${BASE_URL}/iqbot/api/v2/learning-instances`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: "TestLearningInstance",
          description: "Test instance",
        }),
      });

      if (!res.ok) throw new Error(`Status ${res.status}`);
      const data = await res.json();
      if (!data.id) throw new Error("No instance ID in response");
    })
  ) {
    passed++;
  } else {
    failed++;
  }

  // Summary
  log("", "info");
  log("=== Test Summary ===", "info");
  log(`Total Tests: ${passed + failed}`, "info");
  log(`✓ Passed: ${passed}`, "success");
  log(`✗ Failed: ${failed}`, failed > 0 ? "error" : "success");
  log("", "info");

  if (failed === 0) {
    log("🎉 All tests passed! Complete workflow is working perfectly.", "success");
    process.exit(0);
  } else {
    log("❌ Some tests failed. Please review the errors above.", "error");
    process.exit(1);
  }
}

runTests().catch((err) => {
  log(`Fatal error: ${err.message}`, "error");
  process.exit(1);
});
