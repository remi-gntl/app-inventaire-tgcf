<?php
// api.php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Headers: Content-Type');

// 1. Configuration SQL Server
$serverName = "SQL_SERVER, 1433"; // ex: 192.168.1.50, 1433
$connectionOptions = array(
    "Database" => "DB_NAME",
    "Uid" => "DB_USER",
    "PWD" => "DB_PASSWORD",
);

// 2. Connexion
try {
    $conn = new PDO("sqlsrv:server=$serverName;Database={$connectionOptions['Database']}", $connectionOptions['Uid'], $connectionOptions['PWD']);
    $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['status' => 'error', 'message' => 'Erreur connexion SQL: ' . $e->getMessage()]);
    exit;
}

// 3. Réception des données (JSON)
$input = json_decode(file_get_contents('php://input'), true);

if (!$input) {
    echo json_encode(['status' => 'waiting', 'message' => 'API prête. En attente de POST JSON.']);
    exit;
}

$userRef = $input['user'] ?? 'Inconnu';
$scans = $input['scans'] ?? [];

if (empty($scans)) {
    echo json_encode(['status' => 'error', 'message' => 'Aucun scan reçu']);
    exit;
}

// 4. Insertion en base
try {
    $conn->beginTransaction();

    $sql = "INSERT INTO inventaire_scans (user_ref, code_barre, quantite) VALUES (?, ?, ?)";
    $stmt = $conn->prepare($sql);

    foreach ($scans as $scan) {
        $stmt->execute([$userRef, $scan['code'], $scan['qty']]);
    }

    $conn->commit();
    echo json_encode(['status' => 'success', 'count' => count($scans)]);

} catch (Exception $e) {
    $conn->rollBack();
    http_response_code(500);
    echo json_encode(['status' => 'error', 'message' => 'Erreur insertion: ' . $e->getMessage()]);
}
?>