# Resa, an open-source room-booking website

Resa is a room-booking website designed with UX in mind.

It is used in production at French engineering school CentraleSupélec and enables thousands of students, teachers, researchers and staff members to check room availability and book rooms online. Our hope is that it provides an intuitive and natural booking experience.

[Watch the 1-minute demo >>](https://vimeo.com/250163250)

![The booking pop-up](https://github.com/oxlay/Resa/blob/master/images-for-readme/booking-popup.png)

## General structure

It consists of two parts:

- a front-end, namely a single-page JavaScript application written in React
- a back-end, written in Node.js

The back-end is stateless: it communicates with GEODE, a (proprietary) campus management system designed by [Alcuin](http://www.alcuin.com/). If your organization does not use GEODE, Resa will not work out of the box, but you may use the front-end and rewrite the back-end to fit your needs.

## Features

Key features:

- book a room in less than a minute
- receive by email a booking confirmation with an ICS event for your calendar
- easily modify or cancel your booking online
- mobile-friendly interface

Advanced features:

- filter rooms by type or capacity
- use fuzzy search to find a particular room
- see all the events planned for a room on a particular day
- use direct link to book a particular room: `resa.example.com/recherche/{roomId}` (especially useful if you put QR codes outside of rooms that can be booked)

![The room list](https://github.com/oxlay/Resa/blob/master/images-for-readme/room-list.png)

## Built with

- [React](https://reactjs.org/), a JavaScript library for building user interfaces
- [Redux](https://redux.js.org/), a predictable state container for JavaScript apps
- [Bootstrap 4](https://getbootstrap.com), a front-end component library
- [Node.js](https://nodejs.org/en/), a JavaScript runtime for the back-end

As well as many other projects you can find in `front/package.json` and `back/package.json`.

## Authors

**Lead developer:** Anatole Beuzon

**Project manager:** Michel Guennoc

**Contributors and reviewers:** Ronan Pelliard and Sami Tabet

## License

This project is open-source under the [GNU GPLv3 license](https://www.gnu.org/licenses/gpl-3.0.en.html).

## Documentation

To edit the documentation website, you can serve a local mkdocs instance : `docker run --rm -it -p 8000:8000 -v ${PWD}:/docs squidfunk/mkdocs-material`
