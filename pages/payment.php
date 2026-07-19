<?php
/* ============================================================
   BACKEND — payment processing
   Do NOT change field names below; they map to the HTML form inputs.
   ============================================================ */
$conn = mysqli_connect("localhost", "root", "", "data");

if ($conn->connect_error) {
    // In production, log this error instead of echoing it.
    error_log($conn->connect_error);
    die("Database connection failed. Please try again later.");
}

if (isset($_POST['checkout'])) {
    $firstname   = $_POST['firstname'];
    $email       = $_POST['email'];
    $address     = $_POST['address'];
    $city        = $_POST['city'];
    $state       = $_POST['state'];
    $zip         = $_POST['zip'];
    $cardname    = $_POST['cardname'];
    $cardnumber  = $_POST['cardnumber'];
    $expmonth    = $_POST['expmonth'];
    $expyear     = $_POST['expyear'];
    $cvv         = $_POST['cvv'];

    $query = "INSERT INTO payment(firstname,email,address,city,state,zip,cardname,cardnumber,expmonth,expyear,cvv)
              VALUES ('$firstname','$email','$address','$city','$state','$zip','$cardname','$cardnumber','$expmonth','$expyear','$cvv')";

    if (mysqli_query($conn, $query)) {
        echo "<script>alert('Record Inserted Successfully!');window.location.href = '../index.html';</script>";
    }
}
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="description" content="Secure checkout — enter your billing and payment details at We Shopping.">
    <link rel="stylesheet" href="../css/Css.css">
    <script src="https://kit.fontawesome.com/2bbac3a66c.js" crossorigin="anonymous"></script>
    <title>Payment | We Shopping</title>
</head>
<body>
    <a href="#main-content" class="skip-link">Skip to main content</a>

    <header>
        <div class="container">
            <a href="../index.html"><h2>We Shopping</h2></a>
            <nav aria-label="Primary navigation">
                <button type="button" class="toggle-menu" id="menu1"
                        aria-label="Toggle navigation menu" aria-expanded="false">
                    <i class="fas fa-bars" aria-hidden="true"></i>
                </button>
                <ul id="ul" role="list">
                    <li><a href="../index.html">Home</a></li>
                    <li><a href="./shop.html">Shop</a></li>
                    <li><a href="./about.html">About</a></li>
                    <li><a href="./CONTACT.html">Contact</a></li>
                    <li><a href="./signup.php">Sign Up</a></li>
                    <li><a href="./payment.php" aria-current="page">Payment</a></li>
                    <li><a href="./cart.html">Cart</a></li>
                    <li class="cart-icon">
                        <a href="./cart.html" aria-label="Shopping cart">
                            <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg>
                        </a>
                    </li>
                </ul>
            </nav>
        </div>
    </header>

    <main id="main-content" class="payment-page">
        <div class="container">
            <div class="col-75">

                <!--
                    IMPORTANT: Field names (firstname, email, address, city, state, zip,
                    cardname, cardnumber, expmonth, expyear, cvv, checkout) must not change —
                    they map directly to the PHP INSERT above.
                -->
                <form id="form2" name="paymentform" action="payment.php" method="post"
                      novalidate aria-label="Payment and billing form">

                    <div class="payment-row">

                        <!-- Billing address -->
                        <div>
                            <h2>Billing Address</h2>

                            <label for="fname">
                                <i class="fa fa-user" aria-hidden="true"></i> Full Name
                            </label>
                            <input type="text" id="fname" name="firstname"
                                   placeholder="John M. Doe"
                                   autocomplete="name" required>

                            <label for="pemail">
                                <i class="fa fa-envelope" aria-hidden="true"></i> Email
                            </label>
                            <input type="email" id="pemail" name="email"
                                   placeholder="john@example.com"
                                   autocomplete="email" required>

                            <label for="adr">
                                <i class="fa fa-map-marker" aria-hidden="true"></i> Address
                            </label>
                            <input type="text" id="adr" name="address"
                                   placeholder="542 W. 15th Street"
                                   autocomplete="street-address" required>

                            <label for="city">
                                <i class="fa fa-building" aria-hidden="true"></i> City
                            </label>
                            <input type="text" id="city" name="city"
                                   placeholder="New York"
                                   autocomplete="address-level2" required>

                            <div class="payment-subrow">
                                <div>
                                    <label for="state">State</label>
                                    <input type="text" id="state" name="state"
                                           placeholder="NY"
                                           autocomplete="address-level1">
                                </div>
                                <div>
                                    <label for="zip">Zip Code</label>
                                    <input type="text" id="zip" name="zip"
                                           placeholder="10001"
                                           autocomplete="postal-code" inputmode="numeric">
                                </div>
                            </div>
                        </div>

                        <!-- Payment details -->
                        <div>
                            <h2>Payment</h2>

                            <p style="font-size:0.875rem; color:var(--font-muted); margin-bottom:0.5rem;">
                                Accepted cards
                            </p>
                            <div class="icon-container" aria-label="Accepted card types">
                                <i class="fa fa-cc-visa"       style="color:#1a1f71;" title="Visa" aria-label="Visa"></i>
                                <i class="fa fa-cc-mastercard" style="color:#eb001b;" title="Mastercard" aria-label="Mastercard"></i>
                                <i class="fa fa-cc-amex"       style="color:#007bc1;" title="American Express" aria-label="American Express"></i>
                                <i class="fa fa-cc-discover"   style="color:#e65c00;" title="Discover" aria-label="Discover"></i>
                            </div>

                            <label for="cname">Name on Card</label>
                            <input type="text" id="cname" name="cardname"
                                   placeholder="John More Doe"
                                   autocomplete="cc-name" required>

                            <label for="ccnum">Card Number</label>
                            <input type="tel" id="ccnum" name="cardnumber"
                                   placeholder="1111 2222 3333 4444"
                                   autocomplete="cc-number"
                                   inputmode="numeric"
                                   pattern="[\d\s\-]{13,19}"
                                   maxlength="19" required>

                            <label for="expmonth">Expiry Month</label>
                            <input type="text" id="expmonth" name="expmonth"
                                   placeholder="MM (e.g. 09)"
                                   autocomplete="cc-exp-month"
                                   inputmode="numeric"
                                   maxlength="2" required>

                            <div class="payment-subrow">
                                <div>
                                    <label for="expyear">Expiry Year</label>
                                    <input type="text" id="expyear" name="expyear"
                                           placeholder="YY (e.g. 27)"
                                           autocomplete="cc-exp-year"
                                           inputmode="numeric"
                                           maxlength="4" required>
                                </div>
                                <div>
                                    <label for="cvv">CVV</label>
                                    <input type="tel" id="cvv" name="cvv"
                                           placeholder="3–4 digits"
                                           autocomplete="cc-csc"
                                           inputmode="numeric"
                                           maxlength="4" required>
                                </div>
                            </div>
                        </div>

                    </div><!-- /.payment-row -->

                    <label class="checkbox-label">
                        <input type="checkbox" name="sameadr" checked>
                        Shipping address same as billing
                    </label>

                    <input type="submit" id="checkout" name="checkout"
                           value="Continue to Checkout" class="btn">

                </form>
            </div>
        </div>
    </main>

    <div class="popup-message" id="popup-message" role="status" aria-live="polite">
        <p id="message-text"></p>
    </div>

    <footer>
        <div class="container">
            <div class="footer-1">
                <div class="webFooter">
                    <h3>Online Store</h3>
                    <p><a href="./men.html">Men Clothing</a></p>
                    <p><a href="./woman.html">Women Clothing</a></p>
                    <p><a href="./accessories.html">Accessories</a></p>
                </div>
                <div class="webFooter">
                    <h3>Helpful Links</h3>
                    <p><a href="../index.html">Home</a></p>
                    <p><a href="./about.html">About</a></p>
                    <p><a href="./CONTACT.html">Contact</a></p>
                </div>
            </div>
            <p id="text1"></p>
        </div>
    </footer>

    <button type="button" id="myBtn" aria-label="Back to top">
        <i class="fas fa-chevron-up" aria-hidden="true"></i>
    </button>

    <script src="../js/main.js"></script>
</body>
</html>
