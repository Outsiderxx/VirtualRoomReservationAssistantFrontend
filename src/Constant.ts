export const timePeriods: string[] = [
    '8:00 - 9:00',
    '9:00 - 10:00',
    '10:00 - 11:00',
    '11:00 - 12:00',
    '12:00 - 13:00',
    '13:00 - 14:00',
    '14:00 - 15:00',
    '15:00 - 16:00',
    '16:00 - 17:00',
];

export const roomNames: string[] = ['Room1', 'Room2', 'Room3', 'Room4', 'Room5', 'Room6', 'Room7', 'Room8'];

const params: URLSearchParams = new URL(document.location.href).searchParams;
export const backendServerLocation: string = params.get('backendServer') ?? 'http://26.136.49.189:8080'; // test: http://26.136.49.189:8080  demo: http://localhost:8080
