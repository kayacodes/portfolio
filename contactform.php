<?php

$name_error = $email_error = $message = "";
$name = $email = $message = $success = "";

if ($_SEREVER["REQUEST_METHOD"] == "POST"){
    if(empty($POST["name"])){
        $name_error = "Name is Required0";
    } else {
        $name = test_input($POST["name"]);
        if (!preg_match("/^[a-zA-Z ]*$/", $name)) {
            $name_error = "Only letters and white spaces allowed";
        }
    }

    if(empty($POST["mail"])){
        $email_error = "Email is Required";
    } else {
        $email = test_input($POST["mail"]);
        if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
            $email_error = "Invalid Email Format";
        }
    }

    if(empty($POST["message"])){
        $message = "";
    } else {
        $message = test_input($_POST["message"]);
    }

    if ($name_error == '' and $email_error == ''){
        $message = '';
        unset($_POST['submit']);
        foreach ($_POST as $key => $value){
            $message_body .= "$key: $value\n";
        }
        $mailTo = "kayadokrat@gmail.com";
        $subject = "Portfolio - From: ".$email;
        if (mail($mailTo, $subject, $message_body)){
            $success = "Message sent, thank you for contacting me!";
            $name = $email = $message = '';
        }
    }
}

function test_input($data){
    $data = trim($data);
    $data = stripslashes($data);
    $data = htmlspecialchars($data);
    return $data
}



