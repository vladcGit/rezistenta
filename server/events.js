const SEND_INTERVAL = 1000;

const writeEvent = (res, sseId, data) => {
  res.write(`id: ${sseId}\n`);
  res.write(`data: ${data}\n\n`);
};

const sendEvent = (_req, res, dataPromise) => {
  res.writeHead(200, {
    'Cache-Control': 'no-cache',
    Connection: 'keep-alive',
    'Content-Type': 'text/event-stream',
  });

  const sseId = new Date().toDateString();

  async function delay(ms) {
    // return await for better async stack trace support in case of errors.
    return await new Promise((resolve) => setTimeout(resolve, ms));
  }

  const myFunction = function () {
    dataPromise.then((data) => {
      //   console.log(data.getDataValue('Players').length);
      writeEvent(res, sseId, JSON.stringify(data));
    });
    delay(SEND_INTERVAL);
    setTimeout(myFunction, SEND_INTERVAL);
  };
  setTimeout(myFunction, SEND_INTERVAL);

  //   setInterval(() => {
  //     getData.then((data) => writeEvent(res, sseId, JSON.stringify(data)));
  //   }, SEND_INTERVAL);
};

module.exports = sendEvent;
