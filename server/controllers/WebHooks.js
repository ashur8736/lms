const { Webhook } = require("svix");
const User = require("../models/User");
const Stripe = require("stripe"); 
const Purchase = require("../models/Purchase");
const Course = require("../models/Course");

const clerkWebhooks = async (req, res) => {
  try {
    const whook = new Webhook(process.env.CLERK_WEBHOOK_SECRET);

    // Verify and parse webhook
   const evt = whook.verify(req.body, {
  "svix-id": req.headers["svix-id"],
  "svix-timestamp": req.headers["svix-timestamp"],
  "svix-signature": req.headers["svix-signature"],
});


    const { data, type } = evt;

    switch (type) {
      case "user.created": {
        const userData = {
          _id: data.id,
          email: data.email_addresses[0].email_address,
          name: data.first_name + " " + data.last_name,
          imageUrl: data.image_url,
        };

        await User.create(userData);
        return res.json({ success: true });
      }

      case "user.updated": {
        const userData = {
          email: data.email_addresses[0].email_address,
          name: data.first_name + " " + data.last_name,
          imageUrl: data.image_url,
        };

        await User.findByIdAndUpdate(data.id, userData, { new: true });
        return res.json({ success: true });
      }

      case "user.deleted": {
        await User.findByIdAndDelete(data.id);
        return res.json({ success: true });
      }

      default:
        return res.json({ success: true, message: "Unhandled event type" });
    }
  } catch (error) {
    console.error("Webhook error:", error.message);
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

const stripeInstance = new Stripe(process.env.STRIPE_SECRET_KEY);

const stripeWebhooks = async (req, res) => {
  const sig = req.headers["stripe-signature"]; 

  let event;

  try {
    event = Stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    console.error("Stripe webhook error:", err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  try {
    switch (event.type) {
      case "payment_intent.succeeded": {
        const paymentIntent = event.data.object;
        const paymentIntentId = paymentIntent.id;

        const session = await stripeInstance.checkout.sessions.list({
          payment_intent: paymentIntentId,
        });
        const { purchaseId } = session.data[0].metadata;

        const purchaseData = await Purchase.findById(purchaseId);
        const userData = await User.findById(purchaseData.userId);
        const courseData = await Course.findById(
          purchaseData.courseId.toString()
        );

        courseData.enrolledStudents.push(userData._id);
        await courseData.save();

        userData.enrolledCourses.push(courseData._id);
        await userData.save();

        purchaseData.status = "completed";
        await purchaseData.save();

        break;
      }
      case "payment_intent.payment_failed": {
        const paymentIntent = event.data.object;
        const paymentIntentId = paymentIntent.id;

        const session = await stripeInstance.checkout.sessions.list({
          payment_intent: paymentIntentId,
        });
        const { purchaseId } = session.data[0].metadata;

        const purchaseData = await Purchase.findById(purchaseId);
        purchaseData.status = "failed";
        await purchaseData.save();

        break;
      }
      default:
        console.log(`Unhandled Stripe event type: ${event.type}`);
    }

    return res.json({ received: true }); 
  } catch (err) {
    console.error("Error handling Stripe event:", err.message);
    return res.status(500).json({ success: false, message: err.message });
  }
};

module.exports = { clerkWebhooks, stripeWebhooks };
