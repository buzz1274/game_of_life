"use strict"

var game_of_life = {
    living_cells: [],
    pixel_size: 5,
    board_size_x: false,
    board_size_y: false,
    board: [],
    turn: 1,
    total_turns: false,
    canvas: false,

    init: function () {
        this.board_size_x = $('#canvas').width() / this.pixel_size;
        this.board_size_y = $('#canvas').height() / this.pixel_size;
        this.canvas = new fabric.Canvas('canvas');

        var that = this;

        $('#restart').click(function() {
            that.start(false);
        });

        return this;

    },

    start: function(living_cells) {
        if(!living_cells) {
            this.random_cell_start();
        }

        this.total_turns = parseInt($('#turns').val());

        if(isNaN(this.total_turns) || this.total_turns <= 0) {
            this.total_turns = false;
        }

        var that = this;

        this.turn = 1;
        this.configure_board();
        this.evolve();

        setInterval(function() {
            if(!that.total_turns || that.turn <= that.total_turns) {
                $('#turn').html(that.turn);
                that.evolve();
                that.draw_board();
                that.turn++;
            }
        }, 1000);

    },

    random_cell_start: function() {
        this.living_cells = []

        for(var x = 0; x < this.board_size_x; x++) {
            for(var y = 0; y < this.board_size_y; y++) {
                if((Math.floor(Math.random()*25) + 1) == 1) {
                    this.living_cells.push([x, y]);
                }
            }
        }
    },

    configure_board: function() {
        var old_board = [];

        for(var x = 0; x < this.board_size_x; x++) {
            for(var y = 0; y < this.board_size_y; y++) {
                if(typeof this.board[x] == 'undefined') {
                    this.board[x] = [];
                }
                if(typeof old_board[x] == 'undefined') {
                    old_board[x] = [];
                }
                old_board[x][y] = this.board[x][y];
                this.board[x][y] = false;
            }
        }

        for(var co_ords in this.living_cells) {
            if(this.living_cells.hasOwnProperty(co_ords)) {
                if(old_board[this.living_cells[co_ords][0]][this.living_cells[co_ords][1]]) {
                    var colour = 'red';
                } else {
                    var colour = 'green';
                }
                this.board[this.living_cells[co_ords][0]][this.living_cells[co_ords][1]] = colour;
            }
        }
    },

    draw_board: function() {
        this.canvas.clear();

        for(var x = 0; x < this.board_size_x; x++) {
            for(var y = 0; y < this.board_size_y; y++) {
                if(this.is_living_cell(x, y)) {
                    var rect = new fabric.Rect({
                        left: x * this.pixel_size,
                        top: y * this.pixel_size,
                        fill: this.board[x][y],
                        width: this.pixel_size,
                        height: this.pixel_size
                    });

                    this.canvas.add(rect);

                }
            }
        }

    },

    evolve: function() {
        this.living_cells = [];

        for(var x = 0; x < this.board_size_x; x++) {
            for(var y = 0; y < this.board_size_y; y++) {
                var neighbours = this.living_neigbours(x, y);
                if(((neighbours == 2 || neighbours == 3) &&
                    this.is_living_cell(x, y)) ||
                    (neighbours == 3 && !this.board[x][y])) {
                    this.living_cells.push([x, y]);
                }
            }
        }

        this.configure_board();

    },

    living_neigbours: function(x, y) {
        var neighbours = 0;

        for(var i = x - 1; i <= x + 1; i++) {
            for(var j = y - 1; j <= y + 1; j++) {
                if(i >= 0 && j >= 0 && i < this.board_size_x &&
                    j < this.board_size_y && !(i == x && j == y) &&
                    this.is_living_cell(i, j)) {
                    neighbours++;
                }
            }
        }

        return neighbours;

    },

    is_living_cell: function(x, y) {
        if(this.board[x][y]) {
            return true;
        } else {
            return false;
        }
    }

};