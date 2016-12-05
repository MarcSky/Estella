<?php
namespace Lgck\CoreBundle\DataFixtures\ORM;
use Hautelook\AliceBundle\Doctrine\DataFixtures\AbstractLoader;

class DataLoader extends AbstractLoader {
    /**
     * {@inheritdoc}
     */
    public function getFixtures() {
        return [
            __DIR__.'/subdivision.yml',
            __DIR__.'/group.yml',
            __DIR__.'/user.yml',
            __DIR__.'/document.yml',
            __DIR__.'/coursework.yml',
            __DIR__.'/notes.yml',
            __DIR__.'/discipline.yml',
            __DIR__.'/theme.yml'
        ];
    }
}