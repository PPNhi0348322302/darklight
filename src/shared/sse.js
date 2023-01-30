export const STREAM_URL = `${process.env.REACT_APP_BASE_URL}/stream`;

export var ssEvents = new EventSource(STREAM_URL);