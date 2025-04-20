document.addEventListener("DOMContentLoaded", () => {
    const usernameInput = document.getElementById("user-input");
    const searchButton = document.getElementById("search-button");

    const easyLabel = document.getElementById("easy-level");
    const mediumLabel = document.getElementById("medium-level");
    const hardLabel = document.getElementById("hard-level");

    const easyCircle = document.getElementById("easy-circle");
    const mediumCircle = document.getElementById("medium-circle");
    const hardCircle = document.getElementById("hard-circle");

    const cardStatsContainer = document.querySelector(".stats-cards");

    const TOTAL_QUESTIONS = {
        easy: 681,
        medium: 1471,
        hard: 620
    };

    function validateUsername(username) {
        return username && username.trim().length > 0;
    }

    function updateProgress(solved, total, label, circle) {
        if (!label || !circle) return;
        const progress = Math.min((solved / total) * 100, 100);
        circle.style.setProperty("--progress-degree", `${progress}%`);
        label.textContent = `${solved}/${total}`;
    }

    function displayUserData(data) {
        updateProgress(data.easySolved, TOTAL_QUESTIONS.easy, easyLabel, easyCircle);
        updateProgress(data.mediumSolved, TOTAL_QUESTIONS.medium, mediumLabel, mediumCircle);
        updateProgress(data.hardSolved, TOTAL_QUESTIONS.hard, hardLabel, hardCircle);

        const totalQuestions = TOTAL_QUESTIONS.easy + TOTAL_QUESTIONS.medium + TOTAL_QUESTIONS.hard;
        const totalSolvedPercentage = ((data.totalSolved / totalQuestions) * 100).toFixed(1);

        const cardsData = [
            {
                label: "Total Solved",
                value: data.totalSolved,
                subtext: `${totalSolvedPercentage}% of all`,
                highlight: true
            },
            {
                label: "Easy Solved",
                value: data.easySolved,
                subtext: `${((data.easySolved / TOTAL_QUESTIONS.easy) * 100).toFixed(1)}%`
            },
            {
                label: "Medium Solved",
                value: data.mediumSolved,
                subtext: `${((data.mediumSolved / TOTAL_QUESTIONS.medium) * 100).toFixed(1)}%`
            },
            {
                label: "Hard Solved",
                value: data.hardSolved,
                subtext: `${((data.hardSolved / TOTAL_QUESTIONS.hard) * 100).toFixed(1)}%`
            },
            {
                label: "Ranking",
                value: data.ranking ? `#${data.ranking.toLocaleString()}` : "N/A",
                icon: "ranking"
            },
            {
                label: "Contribution",
                value: data.contributionPoints ?? "N/A",
                icon: "contribution"
            }
        ];

        cardStatsContainer.innerHTML = cardsData.map(stat => `
            <div class="card ${stat.highlight ? 'highlight' : ''} card-3d">
                <h4>${stat.label}</h4>
                <p>${stat.value}</p>
                ${stat.subtext ? `<small class="subtext">${stat.subtext}</small>` : ''}
            </div>
        `).join("");
    }

    async function fetchUserDetails(username) {
        const url = `https://leetcode-stats-api.herokuapp.com/${username}`;
        try {
            const response = await fetch(url);
            const data = await response.json();

            if (data.status === "error" || !data.totalSolved) {
                throw new Error("User not found or invalid data");
            }

            displayUserData(data);
        } catch (error) {
            console.error("Error fetching data:", error);
            cardStatsContainer.innerHTML = `
                <div class="card card-3d error">
                    <h4>Error</h4>
                    <p>Unable to fetch data. Please check the username.</p>
                </div>`;
        }
    }

    // Button click event
    searchButton.addEventListener("click", () => {
        const username = usernameInput.value.trim();
        if (validateUsername(username)) {
            fetchUserDetails(username);
        } else {
            alert("Please enter a valid LeetCode username.");
        }
    });

    // Enter key trigger
    usernameInput.addEventListener("keypress", event => {
        if (event.key === "Enter") {
            searchButton.click();
        }
    });
});
