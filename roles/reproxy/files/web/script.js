window.onload = function () {
    updateServerStatus()
    setInterval(() => {
        updateServerStatus()
    }, 5000);
};

// Disable specific error message in console
window.addEventListener('error', function (e) {
    if (e.message.includes('net::ERR_NAME_NOT_RESOLVED')) {
        e.preventDefault();
    }
    if (e.message.includes('Failed to fetch')) {
        e.preventDefault();
    }
});

function updateServerStatus() {
    for (const server of ["helium", "neon"]) {
        fetch(`http://${server}/status`)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                document.getElementById(`${server}-hostname`).classList.remove("high-load")
                updateCpu(document.getElementById(`${server}-cpu-percent`), data.cpu_percent)
                updateMem(document.getElementById(`${server}-mem-percent`), data.mem_percent)
                updateDisk(document.getElementById(`${server}-disk-percent`), data.volumes.root.usage_percent)
                updateUptime(document.getElementById(`${server}-uptime`), data.uptime)
                updateLoadAverage(server, data.load_average.one, data.load_average.five, data.load_average.fifteen)
            })
            .catch(error => {
                if (error instanceof TypeError) {
                    // Handle an error if server is not reacheble
                    document.getElementById('neon-hostname').classList.add("high-load");
                } else {
                    console.error('Other error occurred:', error);
                }
            });
    }
}

function updateCpu(element, value) {
    element.innerText = value + '%';
    element.className = getClassByValue(value)
}

function updateMem(element, value) {
    element.innerText = value + '%';
    element.className = getClassByValue(value)
}

function updateDisk(element, value) {
    element.innerText = value + '%';
    element.className = getClassByValue(value)
}

function updateUptime(element, value) {
    seconds = Number(value);
    var d = Math.floor(seconds / 3600 / 24);
    var h = Math.floor(seconds / 3600 % 24);
    var m = Math.floor(seconds % 3600 / 60);
    var s = Math.floor(seconds % 3600 % 60);

    var dDisplay = d + (d == 1 ? " day" : " days");
    var hDisplay = h + (h == 1 ? " hour" : " hours");
    var mDisplay = m + (m == 1 ? " minute" : " minutes");
    var sDisplay = s + (s == 1 ? " second" : " seconds");

    if (d > 0) {
        element.innerText = dDisplay + ", " + hDisplay;
    } else if (h > 0) {
        element.innerText = hDisplay + ", " + mDisplay;
    } else if (m > 0) {
        element.innerText = mDisplay + ", " + sDisplay;
    } else {
        element.innerText = sDisplay;
    }
}

function updateLoadAverage(server, value_one, value_five, value_fifteen) {
    document.getElementById(`${server}-load-average-one`).innerText = value_one
    document.getElementById(`${server}-load-average-one`).className = getClassByValue(value_one * 100)
    document.getElementById(`${server}-load-average-five`).innerText = value_five
    document.getElementById(`${server}-load-average-five`).className = getClassByValue(value_five * 100)
    document.getElementById(`${server}-load-average-fifteen`).innerText = value_fifteen
    document.getElementById(`${server}-load-average-fifteen`).className = getClassByValue(value_fifteen * 100)
}

function getClassByValue(value) {
    if (value < 50) {
        return 'low-load';
    } else if (value < 80) {
        return 'medium-load';
    } else {
        return 'high-load';
    }
}

function secondsToHms(seconds) {
    seconds = Number(seconds);
    var d = Math.floor(seconds / 3600 / 24);
    var h = Math.floor(seconds / 3600 % 24);
    var m = Math.floor(seconds % 3600 / 60);
    var s = Math.floor(seconds % 3600 % 60);

    var dDisplay = d > 0 ? d + (d == 1 ? " day" : " days") : "";
    var hDisplay = h > 0 ? h + (h == 1 ? " hour" : " hours") : "";
    var mDisplay = m > 0 ? m + (m == 1 ? " minute" : " minutes") : "";
    var sDisplay = s > 0 ? s + (s == 1 ? " second" : " seconds") : "";

    if (d > 0) {
        return dDisplay + ", " + hDisplay;
    } else if (h > 0) {
        return hDisplay + ", " + mDisplay;
    } else {
        return mDisplay + ", " + sDisplay;
    }
}
