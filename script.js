const checkInForm = document.getElementById("checkInForm");
const attendeeNameInput = document.getElementById("attendeeName");
const teamSelect = document.getElementById("teamSelect");
const greeting = document.getElementById("greeting");
const attendeeCount = document.getElementById("attendeeCount");
const progressBar = document.getElementById("progressBar");
const teamStats = document.querySelector(".team-stats");

const teamLabels = {
  water: "Team Water Wise",
  zero: "Team Net Zero",
  power: "Team Renewables",
};

const teamCountElements = {
  water: document.getElementById("waterCount"),
  zero: document.getElementById("zeroCount"),
  power: document.getElementById("powerCount"),
};

const savedDataKey = "intelSummitAttendance";
const attendanceGoalText =
  document.querySelector(".attendance-header").textContent;
const goalMatch = attendanceGoalText.match(/\/\s*(\d+)/);
const attendanceGoal = goalMatch ? Number(goalMatch[1]) : 50;

let attendanceData = {
  attendees: [],
  counts: {
    water: 0,
    zero: 0,
    power: 0,
  },
};

// Create the list with JavaScript so the starter HTML stays unchanged.
const attendeeList = document.createElement("ul");
attendeeList.id = "attendeeList";
attendeeList.style.listStyle = "none";
attendeeList.style.marginTop = "24px";
attendeeList.style.padding = "0";
teamStats.appendChild(attendeeList);

// Keep the goal message separate from each attendee's greeting.
const celebration = document.createElement("p");
celebration.id = "celebration";
celebration.className = "success-message";
celebration.style.display = "none";
celebration.style.fontWeight = "500";
celebration.style.fontSize = "18px";
celebration.style.padding = "16px 20px";
celebration.style.borderRadius = "8px";
celebration.style.marginBottom = "15px";
greeting.insertAdjacentElement("afterend", celebration);

function loadAttendance() {
  const savedData = localStorage.getItem(savedDataKey);

  if (savedData) {
    try {
      const parsedData = JSON.parse(savedData);

      if (Array.isArray(parsedData.attendees) && parsedData.counts) {
        attendanceData = parsedData;
      }
    } catch (error) {
      localStorage.removeItem(savedDataKey);
    }
  }
}

function saveAttendance() {
  localStorage.setItem(savedDataKey, JSON.stringify(attendanceData));
}

function showMessage(message, isSuccess) {
  greeting.textContent = message;
  greeting.classList.toggle("success-message", isSuccess);
  greeting.style.display = "block";
}

function renderAttendance() {
  const totalAttendance = attendanceData.attendees.length;
  const progress = Math.min((totalAttendance / attendanceGoal) * 100, 100);

  attendeeCount.textContent = totalAttendance;
  progressBar.style.width = `${progress}%`;

  Object.keys(teamCountElements).forEach(function (team) {
    teamCountElements[team].textContent = attendanceData.counts[team];
  });

  attendeeList.innerHTML = "";

  attendanceData.attendees.forEach(function (attendee) {
    const listItem = document.createElement("li");
    listItem.textContent = `${attendee.name} - ${teamLabels[attendee.team]}`;
    listItem.style.padding = "8px 0";
    attendeeList.appendChild(listItem);
  });

  if (totalAttendance >= attendanceGoal) {
    showGoalCelebration();
  } else {
    celebration.style.display = "none";
  }
}

function showGoalCelebration() {
  const highestCount = Math.max(
    attendanceData.counts.water,
    attendanceData.counts.zero,
    attendanceData.counts.power,
  );
  const leadingTeams = Object.keys(teamLabels).filter(function (team) {
    return attendanceData.counts[team] === highestCount;
  });
  const leadingTeamNames = leadingTeams
    .map(function (team) {
      return teamLabels[team];
    })
    .join(" and ");

  celebration.textContent = `Goal reached! Congratulations to everyone. ${leadingTeamNames} ${leadingTeams.length === 1 ? "has" : "are tied for"} the highest turnout with ${highestCount} attendee${highestCount === 1 ? "" : "s"}!`;
  celebration.style.display = "block";
}

checkInForm.addEventListener("submit", function (event) {
  event.preventDefault();

  const name = attendeeNameInput.value.trim();
  const selectedTeam = teamSelect.value;

  if (!name || !selectedTeam) {
    showMessage("Please enter a name and select a team.", false);
    return;
  }

  attendanceData.attendees.push({
    name: name,
    team: selectedTeam,
  });
  attendanceData.counts[selectedTeam] += 1;

  saveAttendance();
  renderAttendance();
  checkInForm.reset();

  showMessage(
    `Welcome, ${name}! You checked in with ${teamLabels[selectedTeam].replace("Team ", "")}.`,
    true,
  );
});

loadAttendance();
renderAttendance();
