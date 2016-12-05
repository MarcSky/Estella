<?php
namespace Lgck\ServiceBundle\Services;

use Lgck\ServiceBundle\Component\TypeUploadFile;
use Symfony\Component\DependencyInjection\Container;
use Symfony\Component\HttpFoundation\File\UploadedFile;
use Symfony\Component\HttpKernel\Exception\BadRequestHttpException;

class UploadService {

    const APPLICATION_PDF = "application/pdf";
    const APPLICATION_OCTET_STREAM = "application/octet-stream";
    const APPLICATION_DOC = "application/msword";
    const APPLICATION_DOCX = "application/vnd.openxmlformats-officedocument.wordprocessingml.document";
    const APPLICATION_PPT = "application/vnd.ms-powerpoint";
    const APPLICATION_PPTX = "application/vnd.openxmlformats-officedocument.presentationml.presentation";
    
    protected $_container;
    protected $_pathToWebDir;
    protected $_arrayMimeTypes;
    public function __construct(Container $container){
        $this->_container = $container;
        $path = $this->_container->get('kernel')->getRootdir().'/../web';
        $this->_pathToWebDir = $path;
        $this->_arrayMimeTypes = [self::APPLICATION_DOC, self::APPLICATION_DOCX, self::APPLICATION_OCTET_STREAM,
            self::APPLICATION_PDF, self::APPLICATION_PPT, self::APPLICATION_PPTX];
    }

    public function upload(UploadedFile $file, $type = TypeUploadFile::TYPE_UPLOAD_FILE_FILE){
        $mime_type = $file->getClientMimeType();
        if(!in_array($mime_type, $this->_arrayMimeTypes)) {
            throw new BadRequestHttpException('Bad upload');
        }

        $current_time = time();
        $fileName = md5(base64_encode($current_time . md5($current_time)));

        $mediaFolder = ($type === TypeUploadFile::TYPE_UPLOAD_FILE_FILE) ? 'files' : 'documents';
        $folder = 'documents/' . $mediaFolder;
        $fullPath = $this->_pathToWebDir . '/uploads/' . $folder;
        $fileName .= $fileName . '.pdf';
        $file->move($fullPath, $fileName);
        return $fileName;
    }
    
}