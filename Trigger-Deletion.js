
(async () => {

  // ==========================================
  // 1. TRIGGER TITLES
  // ==========================================

  const triggerTitles = [
    "Boiler Elect Temp above 80",
    "CT Noise above 120",
    "CT Noise above 110",
    "CT Temperature above 90",
    "CT Temperature above 80",
    "Boiler Elect Temp above 90",
    "Boiler Elect Noise above 110",
    "Boiler Elect Noise above 120",
    "Utility Temperature above 90",
    "Utility Noise above 110",
    "Utility Noise above 120",
    "Boiler Mech Temp above 90",
    "Boiler Mech Noise above 110",
    "Boiler Mech Noise above 120",
    "Device Offline",
    "Utility Elect Vel above 7.5",
    "Utility Acc above 9.8",
    "Utility Acc above 19.6",
    "Utility Elect Vel above 11.5",
    "CT Velocity above 7.1",
    "CT Acceleration above 9.8",
    "CT Velocity above 11.1",
    "CT Acceleration above 19.6",
    "Boiler Unit1to4 Vel above 7.5",
    "Boiler Unit1to4 Vel above 11.5",
    "Boiler unti1to4 Acc above 19.6",
    "Boiler Unit1to4 Acc above 9.8",
    "Boiler Unit1to4 Acc above 29.4",
    "Boiler Elect Acc above 9.8",
    "Boiler Elect Vel above 11.5",
    "Boiler Mech Vel above 7.5",
    "Boiler Mech Acc above 4g",
    "Boiler Mech Acc above 3g",
    "Boiler Mech Vel above 11.5",
    "Boiler Elect Vel above 7.5",
    "Boiler Elect Acc above 19.6",
    "Boiler Unit5to8 Acc above 9.8",
    "Boiler unti5to8 Acc above 19.6",
    "Boiler Uni5to8 Acc above 29.4",
    "Boiler Unit1to4 Acc above 39.2",
    "Boiler Unit5to8 Acc above 39.2",
    "Boiler Unit5to8 Vel above 7.5",
    "Boiler Unit5to8 Vel above 11.5",
    "CoolingTower1 4 Vel above 11.5",
    "CoolingTower1to4 Acc above 9.8",
    "CoolingTower1to4Vel above 7.5",
    "CoolingTower5,8 Vel above 11.5",
    "CoolingTower5,8 Vel above 7.5",
    "CoolingTower5to8 Acc above 9.8",
    "CoolingTower5to8Acc above 19.8",
    "CoolingTower1to5Acc above 19.8",
    "Boiler Mech Temp above 80",
    "CCPH Velocity above 11.2",
    "CW Pump Velocity above 7.1",
    "CW Pump Velocity above 11.2",
    "CT MAKEUP Velocity above 11.2",
    "Belt Conveyor Vel above 4.5",
    "Belt Conveyor Vel above 11.2",
    "Compressor Velocity above 11.2",
    "Compressor Velocity above 7.1",
    "SEC Crusher Velocity above 7.1",
    "SEC Crusher Velocity above 12",
    "ACW Pump Acc above 9.8",
    "CT MAKEUP Acc above 9.8",
    "CT MAKEUP Acc above 19.6",
    "SEC Crusher Acc above 9.8",
    "SEC Crusher Acc above 19.6",
    "Compressor Acc above 9.8",
    "Belt Conveyor Acc above 9.8",
    "Belt Conveyor Acc above 19.6",
    "CCPH Velocity above 7.1",
    "CCPH Acc above 9.8",
    "CCPH Acc above 19.6",
    "CT MAKEUP Velocity above 7.1",
    "Compressor Acc above 19.6",
    "ACW Pump Velocity above 4.5",
    "ACW Pump Velocity above 11.2",
    "ACW Pump Acc above 19.6",
    "test cbm ",
    "Noise (Warning) [FLVM_A2205]",
    "Noise (Critical) [FLVM_A2205]",
    "Vertical RMS Velocity (Warning) [FLVM_A2205]",
    "Vertical RMS Velocity (Critical) [FLVM_A2205]",
    "Horizontal RMS Velocity (Warning) [FLVM_A2205]",
    "Horizontal RMS Velocity (Critical) [FLVM_A2205]",
    "Axial RMS Velocity (Warning) [FLVM_A2205]",
    "Axial RMS Velocity (Critical) [FLVM_A2205]"
  ];


  // ==========================================
  // 2. CONFIGURATION
  // ==========================================

  const SEARCH_DELAY = 1200;
  const MODAL_DELAY = 500;
  const DELETE_DELAY = 1500;
  const TIMEOUT = 10000;

  const results = {
    deleted: [],
    notFound: [],
    failed: []
  };

  const wait = ms =>
    new Promise(resolve => setTimeout(resolve, ms));


  // ==========================================
  // 3. HELPER: WAIT FOR ELEMENT
  // ==========================================

  async function waitForElement(selector, timeout = TIMEOUT) {

    const start = Date.now();

    while (Date.now() - start < timeout) {

      const element = document.querySelector(selector);

      if (element) {
        return element;
      }

      await wait(200);
    }

    return null;
  }


  // ==========================================
  // 4. HELPER: SEARCH TRIGGER
  // ==========================================

  function searchTrigger(input, title) {

    const setter = Object.getOwnPropertyDescriptor(
      HTMLInputElement.prototype,
      "value"
    ).set;

    setter.call(input, "");

    input.dispatchEvent(
      new Event("input", { bubbles: true })
    );

    setter.call(input, title);

    input.dispatchEvent(
      new Event("input", { bubbles: true })
    );

    input.dispatchEvent(
      new Event("change", { bubbles: true })
    );
  }


  // ==========================================
  // 5. HELPER: FIND EXACT MATCHING ROW
  // ==========================================

  function findTriggerRow(title) {

    const rows = document.querySelectorAll(
      'tr[amt-data-testid="trigger-list-view-trigger-click"]'
    );

    return [...rows].find(row => {

      const firstCell = row.querySelector("td");

      return firstCell &&
        firstCell.innerText.trim() === title.trim();

    });
  }


  // ==========================================
  // 6. HELPER: WAIT FOR MODAL TO CLOSE
  // ==========================================

  async function waitForModalClose(timeout = TIMEOUT) {

    const start = Date.now();

    while (Date.now() - start < timeout) {

      const modal = document.querySelector(
        'mat-dialog-container [amt-data-testid="action-confirm-submit-btn"]'
      );

      if (!modal) {
        return true;
      }

      await wait(200);
    }

    return false;
  }


  // ==========================================
  // 7. MAIN AUTOMATION
  // ==========================================

  const searchInput = document.querySelector(
    '[amt-data-testid="search-input"]'
  );

  if (!searchInput) {
    console.error("Search input not found. Stopping.");
    return;
  }

  console.log("==================================");
  console.log("TRIGGER DELETION STARTED");
  console.log("Total triggers:", triggerTitles.length);
  console.log("==================================");


  for (let i = 0; i < triggerTitles.length; i++) {

    const title = triggerTitles[i];

    console.log(
      `Processing ${i + 1}/${triggerTitles.length}: ${title}`
    );

    try {

      // Step 1: Search
      searchTrigger(searchInput, title);

      await wait(SEARCH_DELAY);

      // Step 2: Find exact row
      const row = findTriggerRow(title);

      if (!row) {

        console.warn("Trigger not found:", title);

        results.notFound.push(title);

        continue;
      }

      // Step 3: Find delete button
      const deleteButton = row.querySelector(
        '[amt-data-testid="trigger-list-delete-trigger-btn"]'
      );

      if (!deleteButton) {

        console.warn("Delete button not found:", title);

        results.failed.push(title);

        continue;
      }

      // Step 4: Click delete
      deleteButton.click();

      console.log("Delete clicked:", title);

      // Step 5: Wait for confirmation modal
      const continueButton = await waitForElement(
        'mat-dialog-container [amt-data-testid="action-confirm-submit-btn"]'
      );

      if (!continueButton) {

        console.error("Confirmation modal not found:", title);

        results.failed.push(title);

        continue;
      }

      await wait(MODAL_DELAY);

      // Step 6: Verify the correct modal is open
      const modalTitle = document.querySelector(
        'mat-dialog-container [amt-data-testid="action-confirm-title"]'
      );

      if (!modalTitle ||
          modalTitle.innerText.trim() !== "Delete Trigger") {

        console.error("Unexpected confirmation modal:", title);

        results.failed.push(title);

        continue;
      }

      // Step 7: Click Continue
      continueButton.click();

      console.log("Confirmation submitted:", title);

      // Step 8: Wait for modal to close
      const closed = await waitForModalClose();

      if (!closed) {

        console.error("Modal did not close:", title);

        results.failed.push(title);

        continue;
      }

      // Step 9: Wait for list refresh
      await wait(DELETE_DELAY);

      // Step 10: Verify trigger is no longer in the visible results
      const remainingRow = findTriggerRow(title);

      if (!remainingRow) {

        console.log("SUCCESS: Trigger deleted:", title);

        results.deleted.push(title);

      } else {

        console.warn(
          "Trigger still visible after deletion:",
          title
        );

        results.failed.push(title);
      }

    } catch (error) {

      console.error("Error processing:", title, error);

      results.failed.push(title);
    }

    await wait(500);
  }


  // ==========================================
  // 8. FINAL REPORT
  // ==========================================

  console.log("");
  console.log("==================================");
  console.log("TRIGGER DELETION COMPLETED");
  console.log("==================================");

  console.table({
    Total: triggerTitles.length,
    Deleted: results.deleted.length,
    NotFound: results.notFound.length,
    Failed: results.failed.length
  });

  console.log("Deleted triggers:", results.deleted);
  console.log("Not found:", results.notFound);
  console.log("Failed:", results.failed);

  // Make results available in the console
  window.triggerDeletionResults = results;

})();
