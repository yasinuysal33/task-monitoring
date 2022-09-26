import axios from "axios";

async function emailSend(data) {
  console.log(data);
  try {
    await axios.post("http://localhost:5000/send_mail", {
      data,
    });
  } catch (error) {
    console.log(error);
  }
}

export default emailSend;
