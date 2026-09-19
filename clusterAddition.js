const devices = [
  "STM_09056374",
  "STM_09056373",
  "STM_09056371",
  "STM_09056366",
  "STM_09056367",
  "STM_09056370",
  "STM_09056361",
  "STM_09056375",
  "STM_09056369",
  "STM_09056365",
  "STM_09056372",
  "STM_09056364",
  "STM_09056368",
  "STM_09056362",
  "STM_09056211",
  "STM_09056216",
  "STM_09056334",
  "STM_09056097",
  "STM_09056445",
  "STM_09056444",
  "STM_09056432",
  "STM_09056434",
  "STM_09056442",
  "STM_09056436",
  "STM_09056441",
  "STM_09056431",
  "STM_09056437",
  "STM_09056433",
  "STM_09056440",
  "STM_09056435",
  "STM_09056405",
  "STM_09056404",
  "STM_09056408",
  "STM_09056443",
  "STM_09056438",
  "STM_09056439",
  "STM_09056413",
  "STM_09056410",
  "STM_09056401",
  "STM_09056303",
  "STM_09056310",
  "STM_09056313",
  "STM_09056308",
  "STM_09056311",
  "STM_09056309",
  "STM_09056301",
  "STM_09056086",
  "STM_09056200",
  "STM_09056307",
  "STM_09056304",
  "STM_09056305",
  "STM_09056315",
  "STM_09056209",
  "STM_09056199",
  "STM_09056302",
  "STM_09056312",
  "STM_09056314",
  "STM_09056306",
  "STM_09056196"
];

const SEARCH =
  '[amt-data-testid="autocomplete-search-input"]';

const OPTION =
  'mat-option[role="option"]';

const sleep = ms =>
  new Promise(resolve => setTimeout(resolve, ms));


async function waitForSearchBox() {

  for (let i = 0; i < 40; i++) {

    const input = document.querySelector(SEARCH);

    if (input) return input;

    await sleep(250);
  }

  throw new Error("Search box not found");
}


async function setSearchValue(input, value) {

  input.focus();

  const setter =
    Object.getOwnPropertyDescriptor(
      HTMLInputElement.prototype,
      "value"
    ).set;

  setter.call(input, value);

  // Angular input event
  input.dispatchEvent(
    new Event("input", {
      bubbles: true
    })
  );

  await sleep(800);
}


async function findDeviceOption(device) {

  for (let i = 0; i < 40; i++) {

    const options =
      [...document.querySelectorAll(OPTION)];

    const option = options.find(option =>
      option.textContent
        .replace(/\s+/g, " ")
        .trim()
        .includes(device)
    );

    if (option) {
      return option;
    }

    await sleep(250);
  }

  return null;
}


async function selectDevice(device) {

  const input = await waitForSearchBox();

  console.log(`🔎 Searching: ${device}`);

  await setSearchValue(input, device);

  const option =
    await findDeviceOption(device);

  if (!option) {

    console.warn(
      `❌ Device not found: ${device}`
    );

    return false;
  }

  console.log(`✓ Found: ${device}`);

  option.scrollIntoView({
    block: "center"
  });

  await sleep(300);


  // Find checkbox inside this exact option
  const checkbox =
    option.querySelector(
      '[amt-data-testid="autocomplete-search-option-checkbox"]'
    );

  if (!checkbox) {

    console.warn(
      `❌ Checkbox not found for: ${device}`
    );

    return false;
  }


  // Click the actual checkbox label
  const label =
    checkbox.querySelector(
      ".mat-checkbox-layout"
    );

  if (label) {

    label.dispatchEvent(
      new MouseEvent("mousedown", {
        bubbles: true,
        cancelable: true,
        view: window
      })
    );

    label.dispatchEvent(
      new MouseEvent("mouseup", {
        bubbles: true,
        cancelable: true,
        view: window
      })
    );

    label.click();

  } else {

    checkbox.click();
  }


  await sleep(800);

  console.log(
    `✅ Selected: ${device}`
  );

  return true;
}


async function run() {

  console.log(
    `🚀 Starting ${devices.length} devices`
  );

  const failed = [];

  for (let i = 0; i < devices.length; i++) {

    const device = devices[i];

    console.log(
      `\n[${i + 1}/${devices.length}]`
    );

    try {

      const success =
        await selectDevice(device);

      if (!success) {
        failed.push(device);
      }

    } catch (error) {

      console.error(
        `❌ Error: ${device}`,
        error
      );

      failed.push(device);
    }

    await sleep(700);
  }


  console.log("\n==========================");
  console.log("🏁 DONE");
  console.log("==========================");

  console.log(
    `Total: ${devices.length}`
  );

  console.log(
    `Selected: ${devices.length - failed.length}`
  );

  console.log(
    `Failed: ${failed.length}`
  );

  if (failed.length) {
    console.table(failed);
  }
}

run();
