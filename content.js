let adscount = 0;
chrome.storage.session.set({ skipbtn: adscount });

function adskip() {
  window.onload = () => {
    const targetNode = document.getElementById("movie_player") || document.body;
    selfObserver(targetNode);
  };

  function selfObserver(documentNode) {
    const observer = new MutationObserver(function () {
      adFunction();
    });
    const config = {
      subtree: true,
      childList: true,
    };
    observer.observe(documentNode, config);
  }

  function adFunction() {
    const mainDocument = document.getElementsByClassName(
      "video-ads ytp-ad-module"
    );
    const playerOverlay = document.getElementsByClassName(
      "ytp-ad-player-overlay"
    );
    const imageOverlay = document.getElementsByClassName(
      "ytp-ad-image-overlay"
    );

    const skipBtn = document.getElementsByClassName(
      "ytp-ad-skip-button ytp-button"
    );

    const newSkipBtn = document.getElementsByClassName(
      "ytp-ad-skip-button-modern ytp-button"
    );

    const videoDocument = document.getElementsByClassName(
      "video-stream html5-main-video"
    );

    const textOverlay = document.getElementsByClassName("ytp-ad-text-overlay");

    const playerAds = document.getElementById("player-ads");

    function handleSkipBtn() {
      if (skipBtn.length > 0) {
        skipBtn[0].click();

        chrome.storage.session.get(["adNumber"]).then((result) => {
          if (result.adNumber) {
            chrome.storage.session
              .set({ adNumber: result.adNumber + 1 })
              .then(() => {});
          } else {
            chrome.storage.session.set({ adNumber: 1 }).then(() => {});
          }
        });
      }
    }

    function handleNewSkipBtn() {
      if (newSkipBtn.length > 0) {
        newSkipBtn[0].click();

        chrome.storage.session.get(["adNumber"]).then((result) => {
          if (result.adNumber) {
            chrome.storage.session
              .set({ adNumber: result.adNumber + 1 })
              .then(() => {});
          } else {
            chrome.storage.session.set({ adNumber: 1 }).then(() => {});
          }
        });
      }
    }

    if (mainDocument.length > 0) {
      handleSkipBtn();
      handleNewSkipBtn();
      if (playerOverlay.length > 0) {
        playerOverlay[0].style.visibility = "hidden";
        for (let i = 0; i < videoDocument.length; i++) {
          if (videoDocument[i] && videoDocument[i].duration) {
            videoDocument[i].currentTime = videoDocument[i].duration;
          }
        }
        handleSkipBtn();
        handleNewSkipBtn();
      }
      if (imageOverlay.length > 0) {
        imageOverlay[0].style.visibility = "hidden";
      }
    }

    if (playerAds) {
      playerAds.style.display = "none";
    }

    if (textOverlay.length > 0) {
      textOverlay[0].style.display = "none";
    }
  }
}

function safebrowsing() {
  //console.log("safe browsing called!");
  chrome.runtime.sendMessage({ action: "getTabDetails" }, (response) => {
    if (response && response.tabDetails) {
      let url = response.tabDetails.url;
      async function urlCheck() {
        let datatoSend = {
          client: {
            clientId:
              "92313145018-s5ipr832pqqq8qrorusg7j785ol07fev.apps.googleusercontent.com",
            clientVersion: "1.5.2",
          },
          threatInfo: {
            threatTypes: ["MALWARE", "SOCIAL_ENGINEERING"],
            platformTypes: ["WINDOWS"],
            threatEntryTypes: ["URL"],
            threatEntries: [{ url: `${url}` }],
          },
        };
        try {
          let apiUrl =
            "https://safebrowsing.googleapis.com/v4/threatMatches:find?key=AIzaSyAkJaOerP9lOjzpOPgmwYcjS5WH3NF9js8";
          let response = await fetch(apiUrl, {
            method: "POST",

            headers: {
              "Content-Type": "application/json",
            },

            body: JSON.stringify(datatoSend),
          });

          let data = await response.json();

          if (data.matches) {
            chrome.runtime.sendMessage({ contentMessage: "unsafe" });
            chrome.storage.session.set({ data: true });

            chrome.storage.session.get(["number"]).then((result) => {
              if (result.number) {
                chrome.storage.session
                  .set({ number: result.number + 1 })
                  .then(() => {});
              } else {
                chrome.storage.session.set({ number: 1 }).then(() => {});
              }
            });
          } else {
            chrome.storage.session.set({ data: false });
          }
        } catch (error) {
          console.error(error);
        }
      }
      urlCheck();
    }
  });
}

chrome.storage.local.get("buttonState", function (result) {
  const buttonState = result.buttonState || "off";

  if (buttonState === "on") {
    adskip();
  } else {
  }
});

chrome.storage.local.get("safeState", function (result) {
  const safeState = result.safeState || "off";

  if (safeState === "on") {
    safebrowsing();
  } else {
  }
});

// code for analytics

// Analytics ========================

chrome.runtime.sendMessage(
  {
    type: "analytics",
  },
  (response) => {
    if (response && response.details) {
      fn_accordian();
    }
  }
);

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
      const durationInMin = (currentTimeInMs - sessionData.timestamp) / 60000;

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
  console.log("Analytics Working");
}
