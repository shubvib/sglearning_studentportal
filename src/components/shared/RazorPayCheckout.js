import { toast } from "react-toastify";
export function razorPay(props) {
  if (props != null && window) {
    const {
      successPayment,
      failurePayment,
      itemAmount,
      itemImage,
      itemName,
      userEmail,
      userContact,
      userName,
      orderId,
      product_type,
    } = props;
    var options = {
      description: itemName,
      // image: 'https://i.imgur.com/3g7nmJC.png',
      currency: "INR",
      // key: 'rzp_live_FH1N5uUyChEFWj',//old live key

      // key: 'rzp_test_RkEiGtL7vMLv4x',
      key: "rzp_live_PyCe4r9Qp0zDZi",
      // amount: 1 * 100,
      name: "SGLearning",
      handler: function (response) {
        console.log("paymeasdfsdfntsadfs suasdfsdfccess", response);
        successPayment(response);
      },
      order_id: orderId,
      prefill: {
        email: userEmail,
        contact: userContact,
        name: userName,
      },
      // theme: {​​​​​​​​ color: '#F37254' }​​​​​​​​
    };

    var RazorpayCheckout = new window.Razorpay(options);
    RazorpayCheckout.on("payment.failed", function (response) {
      console.log("payment failed");
      failurePayment(response);
    });

    RazorpayCheckout.open(options);
  }
}
