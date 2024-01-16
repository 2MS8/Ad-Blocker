// popup.js
const decline = document.getElementsByClassName("decline-btn")[0];
const accept = document.getElementsByClassName("accept-btn")[0];
const menu = document.getElementsByClassName("fa fa-ellipsis-v")[0];
const sideMenu = document.getElementsByClassName("side-menu")[0];
const closeBtn = document.getElementsByClassName("close-sidebar")[0];
const privacyToggle = document.getElementById("privacyToggle");
const analyticsToggle = document.getElementById("analyticsToggle");
const dataToggle = document.getElementById("dataToggle");
const closeuserconsent = document.querySelectorAll(".fa.fa-close")[1];

closeuserconsent.addEventListener("click", () => {
  document.getElementById("userconsent").style.display = "none";
});

// toggle on analytics

// to persist the state of toggle btn

// for data tracking
chrome.storage.local.get(["dataToggle"]).then((result) => {
  if (result.dataToggle == "on") {
    const newButtonState = "on";
    dataToggle.checked = true;
    chrome.storage.local.set({ dataToggle: newButtonState }).then(() => {});
  } else {
    const newButtonState = "off";
    dataToggle.checked = false;

    chrome.storage.local.set({ dataToggle: newButtonState }).then(() => {});
  }
});

chrome.storage.local.get(["dataToggle"]).then((result) => {
  if (result.dataToggle == "off") {
    chrome.storage.local.set({ dataToggle: "on" });
    dataToggle.checked = true;
  } else {
    chrome.storage.local.set({ dataToggle: "off" });
    dataToggle.checked = false;
  }
});

// on install page

chrome.storage.local.get(["onInstalledDisplay"]).then((result) => {
  if (result.onInstalledDisplay == "on") {
    document.getElementById("userconsentOninstalled").style.display = "block";

    decline.addEventListener("click", () => {
      chrome.storage.local.set({ onInstalledDisplay: "off" });

      document.getElementById("userconsentOninstalled").style.display = "none";

      const currentButtonState = "off";
      chrome.storage.local.set({ safeState: currentButtonState });
      safebtn.checked = false;

      const declinestate = "off";
      chrome.storage.local.set({ checkState: declinestate });
    });

    accept.addEventListener("click", () => {
      chrome.storage.local.set({ onInstalledDisplay: "off" });

      const newState = "on";

      chrome.storage.local.set({ checkState: newState });
      chrome.storage.local.set({ togglebtn: newState });
      chrome.storage.local.set({ analyticsToggle: newState });
      chrome.storage.local.set({ dataToggle: newState });
      dataToggle.checked = true;
      analyticsToggle.checked = true;
      privacyToggle.checked = true;

      document.getElementById("userconsentOninstalled").style.display = "none";

      const currentButtonState = "on";
      chrome.storage.local.set({ safeState: currentButtonState });
      safebtn.checked = true;
    });
  }
});

// on clicking on menu

menu.addEventListener("click", () => {
  sideMenu.style.width = "270px";
});

closeBtn.addEventListener("click", () => {
  sideMenu.style.width = "0";
});

document.addEventListener("DOMContentLoaded", function () {
  let e = document.getElementById("ads");

  // initially

  chrome.storage.local.get(["buttonState"]).then((result) => {
    if (result.buttonState == "on") {
      const newButtonState = "on";
      e.checked = true;
      chrome.storage.local.set({ buttonState: newButtonState }).then(() => {});
    } else {
      const newButtonState = "off";
      e.checked = false;

      chrome.storage.local.set({ buttonState: newButtonState }).then(() => {});
    }
  });

  // on click

  e.addEventListener("click", function () {
    chrome.storage.local.get(["buttonState"]).then((result) => {
      if (result.buttonState == "on") {
        const currentButtonState = "off";
        chrome.storage.local.set({ buttonState: currentButtonState });

        e.checked == false;

        chrome.notifications.create(
          {
            type: "basic",
            iconUrl: "images/icon48.png",
            title: "Ad-Blocker Deactivated",
            message: "Activate Extension to enjoy Ad-free Videos!",
          }
          // () => {}
        );
      } else {
        const currentButtonState = "on";
        chrome.storage.local.set({ buttonState: currentButtonState });
        e.checked == true;

        chrome.notifications.create(
          {
            type: "basic",
            iconUrl: "images/icon48.png",
            title: "Ad-Bocker Activated",
            message: "Enjoy Ad free Surfing!",
          }
          // () => {}
        );
      }
    });
  });
});

// initially
const safebtn = document.getElementById("safe");

chrome.storage.local.get(["safeState"]).then((result) => {
  if (result.safeState == "on") {
    const newButtonState = "on";
    safebtn.checked = true;
    chrome.storage.local.set({ safeState: newButtonState }).then(() => {});
  } else {
    const newButtonState = "off";
    safebtn.checked = false;

    chrome.storage.local.set({ safeState: newButtonState }).then(() => {});
  }
});

// initial state of privacy toggle btn

chrome.storage.local.get(["togglebtn"]).then((result) => {
  if (result.togglebtn == "on") {
    const newButtonState = "on";
    privacyToggle.checked = true;
    chrome.storage.local.set({ togglebtn: newButtonState }).then(() => {});
  } else {
    const newButtonState = "off";
    privacyToggle.checked = false;

    chrome.storage.local.set({ togglebtn: newButtonState }).then(() => {});
  }
});

// onclick for safe browsing

safebtn.addEventListener("click", function () {
  chrome.storage.local.get(["safeState"]).then((result) => {
    if (result.safeState == "on") {
      const currentButtonState = "off";
      chrome.storage.local.set({ safeState: currentButtonState });

      safebtn.checked = false;

      chrome.notifications.create(
        {
          type: "basic",
          iconUrl: "images/icon48.png",
          title: "Safe Browsing Deactivated",
          message: "Activate Extension Safe Browsing!",
        }
        // () => {}
      );
    } else {
      chrome.storage.local.get(["checkState"]).then((result) => {
        if (result.checkState == "off") {
          document.getElementById("userconsentOninstalled").style.display =
            "block";

          privacyToggle.addEventListener("click", () => {
            const currentState = "on";

            chrome.storage.local.set({ checkState: currentState });
            chrome.storage.local.set({ togglebtn: currentState });

            privacyToggle.checked = true;

            chrome.storage.local.set({ safeState: currentState });

            safebtn.checked = true;
          });
        } else {
          const currentButtonState = "on";
          chrome.storage.local.set({ safeState: currentButtonState });
          safebtn.checked = true;
          chrome.notifications.create({
            type: "basic",
            iconUrl: "images/icon48.png",
            title: "Safe Browsing Activated",
            message: "Enjoy Safe browsing",
          });
        }
      });
    }
  });
});

// counter logic
const ads_counter_num = document.getElementById("ads-counter-num");

chrome.storage.session.get(["adNumber"]).then((result) => {
  if (result.adNumber) {
    ads_counter_num.innerHTML = `${result.adNumber}`;
  }
});

// for safe browsing

const harmfullWebsites = document.getElementById("safe-counter-num");

chrome.storage.session.get(["number"]).then((result) => {
  if (result.number) {
    harmfullWebsites.innerHTML = `${result.number}`;
  }
});

// updating dynamic rules

// for initial state

const banner_ads = document.getElementById("google_banner");

chrome.storage.local.get(["bannerads"]).then((result) => {
  if (result.bannerads == "on") {
    const newButtonState = "on";
    banner_ads.checked = true;
    chrome.storage.local.set({ bannerads: newButtonState }).then(() => {});
  } else {
    const newButtonState = "off";
    banner_ads.checked = false;

    chrome.storage.local.set({ bannerads: newButtonState }).then(() => {});
  }
});

// function to reload window
const reloadfunc = () => {
  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    chrome.tabs.reload(tabs[0].id);
  });
};
// onclick for safe browsing

banner_ads.addEventListener("click", function () {
  chrome.storage.local.get(["bannerads"]).then((result) => {
    if (result.bannerads == "on") {
      const currentButtonState = "off";
      chrome.storage.local.set({ bannerads: currentButtonState });
      banner_ads.checked == false;

      add_updte_rules_off();
      reloadfunc();
    } else {
      const currentButtonState = "on";
      chrome.storage.local.set({ bannerads: currentButtonState });
      banner_ads.checked == true;

      add_updte_rules_on();
      reloadfunc();
    }
  });
});

// updating rules here

function add_updte_rules_off() {
  const rulesJsonPath = chrome.runtime.getURL("adblock_rules.json");

  // Fetch the rules.json file
  fetch(rulesJsonPath)
    .then((response) => response.json())
    .then((newRules) => {
      chrome.declarativeNetRequest.getDynamicRules((existingRules) => {
        const addRules = newRules.map((rule, i) => {
          return {
            id: i + 1 + existingRules.length,
            priority: 1,
            action: { type: "allow" },
            condition: {
              urlFilter: rule.condition.urlFilter,
              resourceTypes: rule.condition.resourceTypes,
            },
          };
        });

        const removeRuleIds = existingRules.map((rule) => rule.id);

        chrome.declarativeNetRequest.updateDynamicRules({
          removeRuleIds: removeRuleIds,
          addRules: addRules,
        });
      });
    })
    .catch((error) => {
      console.error("Error fetching rules.json:", error);
    });
}

function add_updte_rules_on() {
  const rulesJsonPath = chrome.runtime.getURL("adblock_rules.json");

  // Fetch the rules.json file
  fetch(rulesJsonPath)
    .then((response) => response.json())
    .then((newRules) => {
      chrome.declarativeNetRequest.getDynamicRules((existingRules) => {
        const addRules = newRules.map((rule, i) => {
          return {
            id: i + 1 + existingRules.length,
            priority: 1,
            action: { type: "block" },
            condition: {
              urlFilter: rule.condition.urlFilter,
              resourceTypes: rule.condition.resourceTypes,
            },
          };
        });
        const removeRuleIds = existingRules.map((rule) => rule.id);

        chrome.declarativeNetRequest.updateDynamicRules({
          removeRuleIds: removeRuleIds,
          addRules: addRules,
        });
      });
    })
    .catch((error) => {
      console.error("Error fetching rules.json:", error);
    });
}

const privacyLi = document.getElementById("privacy-li");

privacyLi.addEventListener("click", () => {
  sideMenu.style.width = "0";
  document.getElementById("userconsent").style.display = "block";

  privacyToggle.addEventListener("click", () => {
    chrome.storage.local.get(["togglebtn"]).then((result) => {
      if (result.togglebtn == "off") {
        const currentState = "on";

        chrome.storage.local.set({ safeState: currentState });

        safebtn.checked = true;

        chrome.storage.local.set({ togglebtn: currentState });
        privacyToggle.checked = true;
      } else {
        const currentState = "off";

        chrome.storage.local.set({ checkState: currentState });
        chrome.storage.local.set({ safeState: currentState });
        safebtn.checked = false;

        chrome.storage.local.set({ togglebtn: currentState });
        privacyToggle.checked = false;
      }
    });
  });
});

// code for analytics

chrome.storage.local.get(["analyticsToggle"]).then((result) => {
  if (result.analyticsToggle == "on") {
    const newButtonState = "on";
    analyticsToggle.checked = true;
    chrome.storage.local.set({ analyticsToggle: newButtonState });
  } else {
    const newButtonState = "off";
    analyticsToggle.checked = false;

    chrome.storage.local.set({ analyticsToggle: newButtonState });
  }
});
analyticsToggle.addEventListener("click", () => {
  chrome.storage.local.get(["analyticsToggle"]).then((result) => {
    if (result.analyticsToggle == "off") {
      analyticsToggle.checked = true;
      const newState = "on";
      chrome.storage.local.set({ analyticsToggle: newState });
    } else {
      analyticsToggle.checked = false;
      const newState = "off";
      chrome.storage.local.set({ analyticsToggle: newState });
    }
  });
});

chrome.storage.local.get(["dataToggle"]).then((result) => {
  if (result.dataToggle == "on") {
    // // Analytics ========================

    function fn_accordian() {
      const GA_ENDPOINT = "https://www.google-analytics.com/mp/collect";
      const MEASUREMENT_ID = `G-GEZVMSL1HL`;
      const API_SECRET = `kFBU-1fVRQeXnpGPFBQUYA`;
      const DEFAULT_ENGAGEMENT_TIME_IN_MSEC = 100;

      async function getOrCreateClientId() {
        const result = await chrome.storage.local.get("clientId");
        let clientId = result.clientId;
        if (!clientId) {
          clientId = self.crypto.randomUUID();
          await chrome.storage.local.set({ clientId });
        }
        return clientId;
      }

      const SESSION_EXPIRATION_IN_MIN = 30;

      async function getOrCreateSessionId() {
        let { sessionData } = await chrome.storage.session.get("sessionData");

        const currentTimeInMs = Date.now();
        if (sessionData && sessionData.timestamp) {
          const durationInMin =
            (currentTimeInMs - sessionData.timestamp) / 60000;

          if (durationInMin > SESSION_EXPIRATION_IN_MIN) {
            sessionData = null;
          } else {
            sessionData.timestamp = currentTimeInMs;
            await chrome.storage.session.set({ sessionData });
          }
        }
        if (!sessionData) {
          sessionData = {
            session_id: currentTimeInMs.toString(),
            timestamp: currentTimeInMs.toString(),
          };
          await chrome.storage.session.set({ sessionData });
        }
        return sessionData.session_id;
      }

      async function otheranalytics() {
        fetch(
          `${GA_ENDPOINT}?measurement_id=${MEASUREMENT_ID}&api_secret=${API_SECRET}`,
          {
            method: "POST",
            body: JSON.stringify({
              // client_id: await getOrCreateSessionId(),
              client_id: await getOrCreateClientId(),
              events: [
                {
                  name: "button_clicked",
                  params: {
                    session_id: await getOrCreateSessionId(),
                    engagement_time_msec: DEFAULT_ENGAGEMENT_TIME_IN_MSEC,
                    id: "my-button",
                  },
                },
              ],
            }),
          }
        );
      }
      otheranalytics();
    }
    fn_accordian();
  }
});
