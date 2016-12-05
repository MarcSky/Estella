<?php
namespace Lgck\ServiceBundle\Controller;
use Lgck\CoreBundle\Controller\AbstractController;
use Lgck\CoreBundle\EntityMap\DocumentMap;
use Lgck\CoreBundle\EntityMap\FileMap;
use Lgck\ServiceBundle\Component\TypeUploadFile;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpKernel\Exception\BadRequestHttpException;
use FOS\RestBundle\Controller\Annotations\Post;

class UploadController extends AbstractController{
    
    public function __construct() {
        $this->entityName = 'File';
        $this->objectClass = self::$entityPath . $this->entityName;
        $this->objectKey   = 'id';
        $this->entityMap = FileMap::map();
    }
    /**
     * @Post("/upload")
     */
    public function postUploadAction(Request $request){
        $file = $request->files->get('file'); // файл
        $type = $request->query->get('type', TypeUploadFile::TYPE_UPLOAD_FILE_FILE); // курсовая или методичка
        if(!$file) {
            throw new BadRequestHttpException('Not right parameters upload');
        }
        $file_upload = $this->get('fewnix.file.upload')->upload($file, $type); //только загружает
        if($type === TypeUploadFile::TYPE_UPLOAD_FILE_DOCUMENT) {
            $this->entityName = 'Document';
            $this->objectClass = self::$entityPath . $this->entityName;
            $this->entityMap = DocumentMap::map();
        }
        $data['path'] = $file_upload;
        return parent::createObjectAction($data);
    }
}