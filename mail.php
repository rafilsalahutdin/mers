<?php
/**
 * Обработчик формы заказа
 * Отправка на: tatarauto@bk.ru
 */

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Method not allowed']);
    exit;
}

$to = 'tatarauto@bk.ru, ar2net@yandex.ru';
function sanitize($data) {
    return htmlspecialchars(trim($data ?? ''), ENT_QUOTES, 'UTF-8');
}

$name = sanitize($_POST['name'] ?? '');
$phone = sanitize($_POST['phone'] ?? '');
$date = sanitize($_POST['date'] ?? '');
$time = sanitize($_POST['time'] ?? '');
$car = sanitize($_POST['car'] ?? '');
$message = sanitize($_POST['message'] ?? '');
// 📧 Динамическая тема из данных заявки
$carInfo = $car ?: 'Не выбран';
$timeInfo = ($date && $time) ? "$date в $time" : 'Уточним';
$subject = " Заявка: {$name} | {$carInfo} | {$timeInfo}";
//$subject = " Заявкас сайта tatarauto.com";
// Кодируем в Base64 (стандарт MIME для кириллицы)
$subject = "=?UTF-8?B?".base64_encode($subject)."?=";

// ✅ Гибкая валидация телефона (только цифры, минимум 10)
$phoneDigits = preg_replace('/\D/', '', $phone);
$errors = [];

if (empty($name) || mb_strlen($name) < 2) {
    $errors[] = 'Некорректное имя';
}
if (strlen($phoneDigits) < 10 || strlen($phoneDigits) > 12) {
    $errors[] = 'Некорректный телефон';
}

if (!empty($errors)) {
    http_response_code(400);
    echo json_encode(['success' => false, 'errors' => $errors]);
    exit;
}

// Форматируем телефон для письма
$phoneFormatted = '+7 (' . substr($phoneDigits, -10, 3) . ') ' .
                  substr($phoneDigits, -7, 3) . '-' .
                  substr($phoneDigits, -4, 2) . '-' .
                  substr($phoneDigits, -2, 2);

$body = "
<!DOCTYPE html>
<html>
<head><meta charset='UTF-8'></head>
<body>
<div class='container'>
    <div class='row'><span class='label'>Имя: </span><span class='value'>{$name}</span></div>
    <div class='row'><span class='label'>Телефон: </span><span class='value'><a href='tel:{$phoneFormatted}' style='color:#D4AF37'>{$phoneFormatted}</a></span></div>
    <div class='row'><span class='label'>Дата: </span><span class='value'>{$date} в {$time}</span></div>
    <div class='row'><span class='label'>Авто: </span><span class='value'>" . ($car ?: 'Не выбран') . "</span></div>
    " . (!empty($message) ? "<div class='row'><span class='label'>Пожелания: </span><span class='value'>{$message}</span></div>" : "") . "
</div>
</body>
</html>";

$headers = "MIME-Version: 1.0\r\n";
$headers .= "Content-type: text/html; charset=UTF-8\r\n";
$headers .= "From: TatarAuto.com <noreply@" . $_SERVER['HTTP_HOST'] . ">\r\n";
$headers .= "Reply-To: {$phoneFormatted}\r\n";

if (mail($to, $subject, $body, $headers)) {
    echo json_encode(['success' => true]);
    // Логируем (опционально)
    file_put_contents('orders.log', date('c') . " | {$name} | {$phone}\n", FILE_APPEND);
} else {
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'Ошибка mail()']);
}
?>