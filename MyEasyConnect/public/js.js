const state = {};

class User {
    addFollower(user) {
        this.followers.push(user);
    }
    addPending(user) {
        this.pending.push(user);
    }
    addUnreadMessage(message) {
        this.unreadMessages.push(message);
    }
    addReadMessage(message) {
        this.readMessages.push(message);
    }
    addUndoneReminder(reminder) {
        this.undoneReminders.push(reminder);
    }
    addDoneReminder(reminder) {
        this.doneReminders.push(reminder);
    }
}

const date = new Date();
const today = {
    'date': date.getDate(),
    'month': date.getMonth(),
    'year': date.getFullYear()
};
let actualMonth = document.getElementsByClassName('actual-month')[0];
let divDays = document.getElementsByClassName('days')[0];

const nextMonth = document.getElementById('next-month');
const previousMonth = document.getElementById('previous-month');




nextMonth.addEventListener('click', () => {
    setCalendar(1);
});

previousMonth.addEventListener('click', () => {
    setCalendar(-1);
});

const deleteMessage = b => {
    b.parentElement.parentElement.previousElementSibling.remove();
    b.closest("div.message-content").remove(); 
}

const openMessage = b => {
    message = b.closest("div");
    if (b.classList.contains('open')) {
        b.classList.remove('open');

        if (message.nextElementSibling.classList.contains('message-content')) {
            message.nextElementSibling.style = "display: none;";    
        }
        
    } else {
        b.classList.add('open');

        if (message.nextElementSibling.classList.contains('message-content')) {
            message.nextElementSibling.style = "display: block;";    
        }
    }
}


const setCalendar = (modifiedMonth = null) => {
    let month;
    let year;

    if (modifiedMonth) date.setMonth(date.getMonth() + modifiedMonth);

    month = getMonth(date.getMonth());
    year = date.getFullYear();

    lastDayMonth = getLastDayOfMonth(date);
    firstDayMonth = getFirstDayOfMonth(date);

    actualMonth.innerHTML = `<b>${month.toUpperCase()} ${year}</b>`;

    divDays.innerHTML = '';

    dateNumber = 1;
    lastDayMonth += firstDayMonth;
    i = 0;
    while (i < lastDayMonth) {

        if (i < firstDayMonth) {
            divDays.innerHTML += `
                <div class="day">
                    <span></span>
                </div>
            `;
        } else {
            divDays.innerHTML += `
                <div class="day ${(dateNumber === today.date && date.getMonth() === today.month && date.getFullYear() === today.year) ? 'actual-day' : ''}">
                    <span>${dateNumber}</span>
                </div>
            `;
            dateNumber++;
        }
        i++;
    }

};



const getLastDayOfMonth = (date) => {
    const lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0);
    return lastDay.getDate();
};

const getFirstDayOfMonth = (date) => {
    const firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
    return firstDay.getDay();
};

const getMonth = (monthNumber) => {
    switch (monthNumber) {
        case 0:
            return "January";
            break;
        case 1:
            return "February";
            break;
        case 2:
            return "March";
            break;
        case 3:
            return "April";
            break;
        case 4:
            return "May";
            break;
        case 5:
            return "June";
            break;
        case 6:
            return "July";
            break;
        case 7:
            return "August";
            break;
        case 8:
            return "September";
            break;
        case 9:
            return "October";
            break;
        case 10:
            return "November";
            break;
        case 11:
            return "December";
            break;
        default:
            break;
    }
};


//UNUSED
const getDay = (dayNumber) => {
    switch (dayNumber) {
        case 0:
            return "Sunday";
            break;
        case 1:
            return "Sunday";
            break;
        case 2:
            return "Tuesday";
            break;
        case 3:
            return "Wednesday";
            break;
        case 4:
            return "Thursday";
            break;
        case 5:
            return "Friday";
            break;
        case 6:
            return "Saturday";
            break;
        default:
            break;
    }
};

setCalendar();

const fetchUser = () => {
    data = { id: 3 };
    fetch('api/user/login', {
        headers: { 'Content-type': 'application/json' },
        method: 'POST',
        body: JSON.stringify(data),
    }).then(res => res.json())
        .then(res => setUser(res))
        .then(() => fetchUserFollowers())
        .then(() => fetchUserMessages())
        .then(() => fetchUserReminders())
        .catch(err => console.log(err));
}

const setUser = user => {

    state.user = new User();

    user.Users.forEach(e => {
        state.user.name = e.Name;
        state.user.notifications = e.Notifications;
        state.user.id = e.Id;
        state.user.employment = e.Employment;
        state.user.points = e.Points;
        state.user.email = e.Email;
    });
    

    const avatar = document.getElementsByClassName("avatar")[0];
    for (var i = 0; i < avatar.children.length; i++) {
        //if (avatar.children[i].tagName == "IMG" && avatar.children[i].alt == "user-avatar")
        if (avatar.children[i].tagName == "DIV" && avatar.children[i].className == "notifications" && avatar.children[i].children[0].tagName == "P") {
            avatar.children[i].children[0].innerHTML = state.user.notifications;
        }

        if (avatar.children[i].tagName == "P" && avatar.children[i].className == "user-name") {
            avatar.children[i].innerHTML = state.user.name;
        }
    }

    const pointsAppCard = document.getElementById("my-points-card");
    for (i = 0; i < pointsAppCard.children.length; i++) {
        if (pointsAppCard.children[i].tagName == "DIV" && pointsAppCard.children[i].className == "score") {
            pointsAppCard.children[i].children[0].children[0].innerHTML = state.user.points;
            break;
        }
    }
}

const fetchUserFollowers = () => {
    data = { id: parseInt(state.user.id) };
    fetch('api/follow/all', {
        headers: { 'Content-type': 'application/json' },
        method: 'POST',
        body: JSON.stringify(data),
    }).then(res => res.json())
        .then(res => setUserFollowers(res))
        .then(() => createFollowersCard())
        .catch(err => console.log(err));
}

const setUserFollowers = users => {
    state.user.followers = new Array();
    users.Follows.forEach(e => {
        state.user.addFollower(e.User);
    });
    state.user.pending = new Array();
    users.Pending.forEach(e => {
        state.user.addPending(e.User);
    });
    const followAppCard = document.getElementById("circle-of-care-card");
    for (i = 0; i < followAppCard.children.length; i++) {
        if (followAppCard.children[i].tagName == "DIV" && followAppCard.children[i].className == "notifications") {
            followAppCard.children[i].children[0].innerHTML = state.user.pending.length;
            break;
        }
    }

}

const fetchUserMessages = () => {
    data = { id: parseInt(state.user.id) };
    fetch('api/message/all', {
        headers: { 'Content-type': 'application/json' },
        method: 'POST',
        body: JSON.stringify(data),
    }).then(res => res.json())
        .then(res => setUserMessages(res))
        .then(() => createMessages())
        .catch(err => console.log(err));
}

const setUserMessages = messages => {
    state.user.readMessages = new Array();
    state.user.unreadMessages = new Array();
    messages.Messages.forEach(e => {
        //state.user.addFollower(e.User);
        if (e.Read == 0) {
            state.user.addUnreadMessage(e);
        } else {
            state.user.addReadMessage(e);
        }
    });

    const inboxNotifications = document.getElementById("inbox-notifications");
    for (i = 0; i < inboxNotifications.children.length; i++) {
        if (inboxNotifications.children[i].tagName == "P" && inboxNotifications.children[i].className == "notification-number") {
            inboxNotifications.children[i].innerHTML = state.user.unreadMessages.length;
            break;
        }
    }
    const messagingAppCard = document.getElementById("alerts-and-messaging-card");
    for (i = 0; i < messagingAppCard.children.length; i++) {
        if (messagingAppCard.children[i].tagName == "DIV" && messagingAppCard.children[i].className == "notifications") {
            messagingAppCard.children[i].children[0].innerHTML = state.user.unreadMessages.length;
            break;
        }
    }
}

const fetchUserReminders = () => {
    data = { id: parseInt(state.user.id) };
    fetch('api/reminder/all', {
        headers: { 'Content-type': 'application/json' },
        method: 'POST',
        body: JSON.stringify(data),
    }).then(res => res.json())
        .then(res => setUserReminders(res))
        .then(() => createRemindersCard())
        .catch(err => console.log(err));
}

const setUserReminders = reminders => {
    state.user.undoneReminders = new Array();
    state.user.doneReminders = new Array();

    reminders.Reminders.forEach(e => {
        if (e.Done == 0)
            state.user.addUndoneReminder(e);
        else
            state.user.addDoneReminder(e);
    });

    const remindersAppCard = document.getElementById("reminders-calendar-card");
    for (i = 0; i < remindersAppCard.children.length; i++) {
        if (remindersAppCard.children[i].tagName == "DIV" && remindersAppCard.children[i].className == "notifications") {
            remindersAppCard.children[i].children[0].innerHTML = state.user.undoneReminders.length;
            break;
        }
    }
}

const createFollowersCard = () => {
    const people = document.getElementsByClassName("people")[0];
    people.innerHTML = '';
    let content = '';
    let counter = 1;
    let max = 0;
    let green = false;
    state.user.followers.forEach(e => {
        if (counter == 2 || counter == (max + 3)) {
            green = true;
            max = counter;
        } else {
            green = false;
        }
        content += `
            <div class="people-card">
                <div class="left-column${green ? "-green" : "-red"}"></div>
                <div class="user-detail">
                    <div class="name">
                        <p>
                            <b>${e.Name}</b>
                        </p>
                        <p>${e.Employment}</p>
                    </div>
                    <div class="image">
                        <img src="public/img/senior.png" alt="user-image">
                    </div>
                    <div class="message${green ? "-green" : ''}">
                        <button>
                            Send Message
                        </button>
                    </div>
                </div>
            </div>
        `;
        counter++;
    });
    people.innerHTML = content;
}

const createMessages = () => {
    const messagesContainer = document.getElementById("messages-container");
    let content = '';
    messagesContainer.innerHTML = '';

    state.user.unreadMessages.forEach(e => {
        let date = e.SendAt.split("T");
        content += `
            <div class="messages">
                <label class="input-container">
                    .
                    <input type="checkbox">
                    <span class="checkmark"></span>
                </label>
                <div class="user">
                    <div class="user-status offline"></div>
                    <p class="user-name">${e.Sender_name}</p>
                </div>
                <div class="message-title">
                    <p>${e.Subject}</p>
                </div>
                <div class="message-date">
                    <p>${date[0]}</p>
                </div>
                <button>
                    <i class="fas fa-sort-down"></i>
                </button>
            </div>
            <div class="message-content" style='display: none;'>
                <p>${e.Subject}</p>
                <p>
                    ${e.Content}
                </p>
                <div class="btn-container">
                    <button class="reply-message">REPLY</button>
                    <button class="delete-message">DELETE</button>
                </div>
            </div>
        `;
    });

    state.user.readMessages.forEach(e => {
        let date = e.SendAt.split("T");
        content += `
            <div class="messages">
                <label class="input-container">
                    .
                    <input type="checkbox">
                    <span class="checkmark"></span>
                </label>
                <div class="user">
                    <div class="user-status offline"></div>
                    <p class="user-name">${e.Sender_name}</p>
                </div>
                <div class="message-title">
                    <p>${e.Subject}</p>
                </div>
                <div class="message-date">
                    <p>${date[0]}</p>
                </div>
                <button>
                    <i class="fas fa-sort-down"></i>
                </button>
            </div>
            <div class="message-content" style='display: none;'">
                <p>${e.Subject}</p>
                <p>
                    ${e.Content}
                </p>
                <div class="btn-container">
                    <button class="reply-message">REPLY</button>
                    <button class="delete-message">DELETE</button>
                </div>
            </div>
        `;
    });
    content += `<div class="messages">
                        <div class="previously-messages">
                            <p>5 Previously Messages</p>
                        </div>
                    </div>`;
    messagesContainer.innerHTML = content;

    // ADDING EVENTLISTENERS TO SHOW/HIDE MESSAGE
    const messages = document.getElementsByClassName('messages');
    const messages_array = [...messages];

    let buttons = [];
    messages_array.forEach(e => {
        if (e.children[4]) buttons.push(e.children[4]);
    });

    buttons.forEach(b => {
        b.addEventListener('click', () => {
            openMessage(b);
        });
    });


    // ADDING EVENTLISTENERS TO DELETE MESSAGE
    const deleteButtonMessage = document.querySelectorAll(".message-content .btn-container .delete-message");
    deleteButtonMessage.forEach(b => {
        b.addEventListener('click', () => {
            deleteMessage(b);
        });
    });

}

const createRemindersCard = () => {
    const reminderCard = document.getElementsByClassName("today")[0];
    let content = '';
    reminderCard.innerHTML = '';
    content += `
        <div class="date">
            <h5>TODAY</h5>
            <p>2 JULY / MONDAY</p>
        </div>
    `;
    state.user.doneReminders.forEach(e => {
        if (e.Description == "") {
            content += `
                <div class="reminder-title contact">
                    <i class="fas fa-phone"></i>
                    <div class="title-info">
                        <p>${e.Title}</p>
                        <p>${e.Subtitle}</p>
                    </div>
                </div>
            `;
        } else {
            let time = e.Date.split("T");
            content += `
                <div class="reminder-title">
                    <i class="far fa-calendar-alt"></i>
                    <div class="title-info">
                        <p>${e.Title}</p>
                        <p>${e.Subtitle}</p>
                    </div>
                    <button class="dismiss">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                <div class="reminder-content">
                    <div class="date-time">
                        2 JULY 2012 /
                        <span class="time">${time[1]}</span>
                    </div>
                    <div class="description">
                        <p>${e.Description}</p>
                    </div>
                    <div class="buttons">
                        <button class="change">CHANGE</button>
                        ${e.Done == 0 ? "<button class='done'>DONE</button>" : ''}
                    </div>
                </div>
            `;
        }
    });
    state.user.undoneReminders.forEach(e => {
        if (e.Description == "") {
            content += `
                <div class="reminder-title contact">
                    <i class="fas fa-phone"></i>
                    <div class="title-info">
                        <p>${e.Title}</p>
                        <p>${e.Subtitle}</p>
                    </div>
                </div>
            `;
        } else {
            let time = e.Date.split("T");
            content += `
                <div class="reminder-title">
                    <i class="far fa-calendar-alt"></i>
                    <div class="title-info">
                        <p>${e.Title}</p>
                        <p>${e.Subtitle}</p>
                    </div>
                    <button class="dismiss">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                <div class="reminder-content">
                    <div class="date-time">
                        2 JULY 2012 /
                        <span class="time">${time[1]}</span>
                    </div>
                    <div class="description">
                        <p>${e.Description}</p>
                    </div>
                    <div class="buttons">
                        <button class="change">CHANGE</button>
                        ${e.Done == 0 ? "<button class='done'>DONE</button>" : ''}
                    </div>
                </div>
            `;
        }
    });
    reminderCard.innerHTML = content;
}

fetchUser();