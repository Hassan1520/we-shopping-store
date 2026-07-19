<?php
$conn = mysqli_connect("localhost", "root", "", "data");

// Check the connection
if ($conn->connect_error) {
    echo $conn->connect_error;
}
?>

<?php

if (isset($_POST['submit'])) {
    // Get the form data
	$username = $_POST['username'];
	$email = $_POST['email'];
	$password = $_POST['password'];
	$confirmpassword = $_POST['confirmpassword'];

    // Insert the data into the database
    $query = "INSERT INTO signup (username,email,password,confirmpassword) VALUES ('$username','$email','$password','$confirmpassword')";
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
    <meta name="description" content="Create your free We Shopping account.">
    <link rel="stylesheet" href="../css/signup.css">
    <script src="https://kit.fontawesome.com/2bbac3a66c.js" crossorigin="anonymous"></script>
    <title>Sign Up | We Shopping</title>
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
                    <li><a href="./signup.php" aria-current="page">Sign Up</a></li>
                    <li><a href="./payment.php">Payment</a></li>
                    <li><a href="./cart.html">Cart</a></li>
                </ul>
            </nav>
        </div>
    </header>

    <main id="main-content">
        <div class="container-1">
            <div class="title">
                <h1>Create Account</h1>
            </div>
            <!--
                Field names (username, email, password, confirmpassword, submit)
                must not change — they map directly to the PHP INSERT above.
            -->
            <form id="form" name="signupform" action="signup.php" method="post" novalidate>
                <div class="conta-input">
                    <label for="username">Username</label>
                    <input type="text" id="username" name="username"
                           placeholder="Your username" autocomplete="username" required>
                    <i class="fas fa-check-circle" aria-hidden="true"></i>
                    <i class="fas fa-exclamation-circle" aria-hidden="true"></i>
                    <p class="error-0" role="alert" aria-live="polite"></p>
                    <p class="suc-0"></p>
                </div>
                <div class="conta-input">
                    <label for="email">Email</label>
                    <input type="email" id="email" name="email"
                           placeholder="your@email.com" autocomplete="email" required>
                    <i class="fas fa-check-circle" aria-hidden="true"></i>
                    <i class="fas fa-exclamation-circle" aria-hidden="true"></i>
                    <p class="error-1" role="alert" aria-live="polite"></p>
                    <p class="suc-1"></p>
                </div>
                <div class="conta-input">
                    <label for="password">Password</label>
                    <input type="password" id="password" name="password"
                           placeholder="Min 6 chars, 1 number, 1 symbol"
                           autocomplete="new-password" required>
                    <i class="fas fa-check-circle" aria-hidden="true"></i>
                    <i class="fas fa-exclamation-circle" aria-hidden="true"></i>
                    <p class="error-2" role="alert" aria-live="polite"></p>
                    <p class="suc-2"></p>
                </div>
                <div class="conta-input">
                    <label for="confirm-password">Confirm Password</label>
                    <input type="password" id="confirm-password" name="confirmpassword"
                           placeholder="Repeat your password"
                           autocomplete="new-password" required>
                    <i class="fas fa-check-circle" aria-hidden="true"></i>
                    <i class="fas fa-exclamation-circle" aria-hidden="true"></i>
                    <p class="error-3" role="alert" aria-live="polite"></p>
                    <p class="suc-3"></p>
                </div>
                <button type="submit" id="submit" name="submit">Create Account</button>
            </form>
        </div>
    </main>

    <script src="../js/main.js"></script>
    <script src="../js/signup-form.js"></script>
</body>
</html>