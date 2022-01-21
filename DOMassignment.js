class Player {
    constructor(name, race, job, specialization, level) {
        this.name = name;
        this.race = race;
        this.job = job;
        this.specialization = specialization;
        this.level = level;
    }
}

class UI {
    static displayPlayer() {
        const players = Store.getPlayers();
        
        players.forEach((player) => UI.addPlayerToList(player));
    }

    static addPlayerToList(player) {
        const list = document.querySelector('#player-list');

        const row = document.createElement('tr');

        row.innerHTML = `
            <td>${player.name}</td>
            <td>${player.race}</td>
            <td>${player.job}</td>
            <td>${player.specialization}</td>
            <td>${player.level}</td>
            <td><a href="#" class="btn btn-danger btn-sm delete">X</a></td>
            `;

        list.appendChild(row);
    }

    static deletePlayer(element) {
        if(element.classList.contains('delete')) {
            element.parentElement.parentElement.remove();
        }
    }

    static showAlert(message, className) {
        const div = document.createElement('div');
        div.className = `alert alert-${className}`;
        div.appendChild(document.createTextNode(message));
        const container = document.querySelector('.container');
        const form = document.querySelector('#player-form');
        container.insertBefore(div, form);
        setTimeout(() => document.querySelector('.alert').remove(), 2000);
    }

    static clearFields() {
        document.querySelector('#name').value = '';
        document.querySelector('#race').value = '';
        document.querySelector('#job').value = '';
        document.querySelector('#specialization').value = '';
        document.querySelector('#level').value = '';
    }
}

class Store {
    static getPlayers() {
        let players;
        if(localStorage.getItem('players') === null) {
            players = [];
        } else {
            players = JSON.parse(localStorage.getItem('players'));
        }

        return players;
    }

    static addPlayer(player) {
        const players = Store.getPlayers();

        players.push(player);

        localStorage.setItem('players', JSON.stringify(players));
    }

    static removePlayer(level) {
        const players = Store.getPlayers();

        players.forEach((player, index) => {
            if(player.level === level) {
                players.splice(index, 1);
            }
        });

        localStorage.setItem('players',JSON.stringify(players));
    }
}

document.addEventListener('DOMContentLoaded', UI.displayPlayer);

document.querySelector('#player-form').addEventListener('submit', (e) => {
    e.preventDefault();

    const name = document.querySelector('#name').value
    const race = document.querySelector('#race').value
    const job = document.querySelector('#job').value
    const specialization = document.querySelector('#specialization').value
    const level = document.querySelector('#level').value

    if(name === '' || race === '' || job === '' || specialization === '' || level === '') {
        UI.showAlert('Please fill in all fields', 'danger');
    } else {
        const player = new Player(name, race, job, specialization, level);

        UI.addPlayerToList(player);

        Store.addPlayer(player);

        UI .showAlert('Player Added', 'success');

        UI.clearFields();
    }
});

document.querySelector('#player-list').addEventListener('click', (e) => {
    UI.deletePlayer(e.target)

    Store.removePlayer(e.target.parentElement.previousElementSibling.textContent);

    UI .showAlert('Player Removed', 'success');
});