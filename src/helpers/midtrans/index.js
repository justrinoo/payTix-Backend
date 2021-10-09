require("dotenv").config();
const midtransClient = require("midtrans-client");
const bookingModel = require("../../modules/booking/bookingModel");

const snap = new midtransClient.Snap({
	isProduction: false,
	serverKey: process.env.MIDTRANS_SERVER_KEY,
	clientKey: process.env.MIDTRANS_CLIENT_KEY,
});

module.exports = {
	transactions: (orderId, amount) =>
		new Promise((resolve, reject) => {
			let parameter = {
				transaction_details: {
					order_id: orderId,
					gross_amount: amount,
				},
				credit_card: {
					secure: true,
				},
			};

			snap
				.createTransaction(parameter)
				.then((transaction) => {
					resolve(transaction.redirect_url);
				})
				.catch((error) => reject(error));
		}),
	notification: (body) =>
		new Promise((resolve, reject) => {
			snap.transaction
				.notification(body)
				.then(async (response) => {
					const order_id = response.order_id;
					let transactionStatus = response.transaction_status;
					const payment_type = response.payment_type;
					const fraudStatus = response.fraud_status;

					if (transactionStatus == "capture") {
						// 	// capture only applies to card transaction, which you need to check for the fraudStatus
						if (fraudStatus == "challenge") {
							// TODO set transaction status on your databaase to 'challenge'
							await bookingModel.updateTransactionMidtrans(
								payment_type,
								transactionStatus,
								order_id
							);
						} else if (fraudStatus == "accept") {
							// TODO set transaction status on your databaase to 'success'
							await bookingModel.updateTransactionMidtrans(
								payment_type,
								(transactionStatus = "Success"),
								order_id
							);
						}
					} else if (transactionStatus == "settlement") {
						// TODO set transaction status on your databaase to 'success'

						const data = await bookingModel.updateTransactionMidtrans(
							payment_type,
							(transactionStatus = "Success"),
							order_id
						);
						resolve(data);
					} else if (transactionStatus == "deny") {
						// TODO you can ignore 'deny', because most of the time it allows payment retries
						// and later can become success
					} else if (
						transactionStatus == "cancel" ||
						transactionStatus == "expire"
					) {
						// TODO set transaction status on your databaase to 'failure'
						await bookingModel.updateTransactionMidtrans(
							payment_type,
							(transactionStatus = "Failure"),
							order_id
						);
					} else if (transactionStatus == "pending") {
						// TODO set transaction status on your databaase to 'pending' / waiting payment
						await bookingModel.updateTransactionMidtrans(
							payment_type,
							(transactionStatus = "Pending"),
							order_id
						);
					}
				})
				.catch((error) => console.log(error));
		}),
};
