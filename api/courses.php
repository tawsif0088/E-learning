<?php
header('Content-Type: application/json');
session_start();

require_once '../config/constants.php';
require_once '../classes/Auth.php';
require_once '../classes/Course.php';

$auth = new Auth();
if (!$auth->isLoggedIn()) {
    http_response_code(401);
    echo json_encode(['error' => 'Unauthorized']);
    exit;
}

$method = $_SERVER['REQUEST_METHOD'];
$course = new Course();

switch($method) {
    case 'GET':
        $courses = $course->getUserCourses($auth->getCurrentUser()['id']);
        echo json_encode($courses);
        break;

    case 'POST':
        $data = json_decode(file_get_contents('php://input'), true);
        $result = $course->create($data, $auth->getCurrentUser()['id']);
        echo json_encode($result);
        break;

    default:
        http_response_code(405);
        echo json_encode(['error' => 'Method not allowed']);
}
?>