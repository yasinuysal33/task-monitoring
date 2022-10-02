import axios from "axios";

async function emailSend(data) {
  console.log(data);
  try {
    await axios.post(`${process.env.PUBLIC_URL}/send_mail`, {
      data,
    });
  } catch (error) {
    console.log(error);
  }
}

export default emailSend;
