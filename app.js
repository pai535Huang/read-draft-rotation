const members = ["HB", "SB", "XY", "YX", "ZZ", "Nathan", "Tommy"];
const mentor = "HB";
const students = members.filter((member) => member !== mentor);
const studentCycleLength = students.length - 1;
const mentorCycleLength = students.length;
const startDate = new Date(2026, 5, 1);
const millisecondsPerDay = 24 * 60 * 60 * 1000;
const weekStartsOn = 0;

const weekTitle = document.querySelector("#weekTitle");
const assignmentList = document.querySelector("#assignmentList");

function getOffset(week) {
  return ((week - 1) % studentCycleLength) + 1;
}

function getAssignments(week) {
  const offset = getOffset(week);
  const mentorTarget = students[(week - 1) % mentorCycleLength];
  const studentAssignments = students.map((reader, readerIndex) => {
    const targetIndex = (readerIndex + offset) % students.length;

    return {
      reader,
      target: students[targetIndex],
    };
  });

  return members.map((reader) => {
    if (reader === mentor) {
      return {
        reader,
        target: mentorTarget,
      };
    }

    const assignment = studentAssignments.find((item) => item.reader === reader);

    return {
      reader,
      target: assignment.target,
    };
  });
}

function getLocalDateOnly(date) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

function getCurrentWeek(today = new Date()) {
  const localToday = getLocalDateOnly(today);
  const elapsedDays = Math.floor((localToday - startDate) / millisecondsPerDay);

  if (elapsedDays < 0) {
    return 1;
  }

  const daysUntilNextWeek = (7 - startDate.getDay() + weekStartsOn) % 7 || 7;

  if (elapsedDays < daysUntilNextWeek) {
    return 1;
  }

  return Math.floor((elapsedDays - daysUntilNextWeek) / 7) + 2;
}

function renderAssignmentList(assignments) {
  assignmentList.innerHTML = "";

  assignments.forEach((assignment) => {
    const row = document.createElement("article");
    row.className = "assignment";

    row.innerHTML = `
      <div class="person">${assignment.reader}</div>
      <div class="arrow" aria-hidden="true">←</div>
      <div class="paper">${assignment.target}</div>
    `;

    assignmentList.append(row);
  });
}

function render() {
  const today = getLocalDateOnly(new Date());
  const currentWeek = getCurrentWeek(today);
  const assignments = getAssignments(currentWeek);

  weekTitle.textContent = `第 ${currentWeek} 周`;

  renderAssignmentList(assignments);
}

render();
